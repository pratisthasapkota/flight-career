import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { product, products, paymentSessions } from "../db/schema.js";
import { sendEmail } from "../email.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const ONLINE_PAYMENTS = ["Khalti", "eSewa", "FonePay", "Card"];

const orderItemSchema = z.object({
  productId: z.number().int().positive().optional().nullable(),
  productname: z.string().min(1, "Product name is required").max(255),
  quantity: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v >= 1 && v <= 100, "Quantity must be between 1 and 100"),
  price: z.union([z.string(), z.number()]).optional().nullable(),
  size: z.string().max(50).optional().nullable(),
});

const orderSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email").max(255),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  phone: z.string().min(1, "Phone is required").max(50),
  paymentMethod: z.string().max(50).optional().default("Cash on Delivery"),
  paymentSessionId: z.string().max(100).optional().nullable(),
  paymentTxnId: z.string().max(100).optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item").max(20),
});

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const raw = req.body as Record<string, unknown>;
    const body = {
      name: raw.name,
      email: raw.email,
      address: raw.address,
      city: raw.city,
      postalCode: raw.postalCode,
      phone: raw.phone,
      paymentMethod: raw.paymentMethod || "Cash on Delivery",
      paymentSessionId: raw.paymentSessionId,
      paymentTxnId: raw.paymentTxnId,
      items:
        Array.isArray(raw.items) && raw.items.length
          ? raw.items
          : [
              {
                productId: raw.productId,
                productname: raw.productname,
                quantity: raw.quantity,
                price: raw.price,
                size: raw.size,
              },
            ],
    };

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { name, email, address, city, postalCode, phone, paymentMethod, paymentSessionId, paymentTxnId, items } =
      parsed.data;
    const productIds = items
      .map((item) => item.productId)
      .filter((id): id is number => typeof id === "number");

    const catalogRows = productIds.length
      ? await db.select().from(products).where(inArray(products.id, productIds))
      : [];
    const catalogById = new Map(catalogRows.map((row) => [row.id, row]));

    type PricedItem = (typeof items)[number] & {
      unitPrice: number;
      productName: string;
    };

    let pricedItems: PricedItem[];
    try {
      pricedItems = items.map((item) => {
        if (item.productId) {
          const catalog = catalogById.get(item.productId);
          if (!catalog || catalog.active === false) {
            throw new Error("One of the products is no longer available");
          }
          const stock = catalog.stock ?? 0;
          if (stock <= 0) {
            throw new Error(`${catalog.name} is out of stock`);
          }
          if (item.quantity > stock) {
            throw new Error(`Only ${stock} units of ${catalog.name} are available`);
          }
          return {
            ...item,
            unitPrice: Number(catalog.price || 0),
            productName: catalog.name,
          };
        }

        const unitPrice = Number(item.price ?? 0);
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          throw new Error("Invalid price for custom item");
        }
        return { ...item, unitPrice, productName: item.productname };
      });
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: (err as Error).message });
    }

    if (
      paymentMethod !== "Cash on Delivery" &&
      pricedItems.some((item) => !item.productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Online payment is only available for catalog products.",
      });
    }

    const orderId =
      "ORD-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderDate = new Date().toISOString();

    let isPaid = false;

    if (paymentMethod === "Cash on Delivery") {
      isPaid = false;
    } else if (ONLINE_PAYMENTS.includes(paymentMethod)) {
      if (!paymentSessionId) {
        return res
          .status(400)
          .json({ success: false, message: "Payment was not completed. Please complete the payment first." });
      }

      const sessions = await db
        .select()
        .from(paymentSessions)
        .where(eq(paymentSessions.sessionId, paymentSessionId));

      if (sessions.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Payment session not found. Please complete the payment first." });
      }

      const session = sessions[0];

      if (session.status !== "completed") {
        return res
          .status(400)
          .json({ success: false, message: "Payment has not been verified. Please complete the payment first." });
      }

      if (session.used) {
        return res
          .status(400)
          .json({ success: false, message: "This payment has already been used for an order." });
      }

      if (session.paymentMethod !== paymentMethod) {
        return res
          .status(400)
          .json({ success: false, message: "Payment method mismatch. Please restart checkout." });
      }

      if (
        session.customerEmail &&
        session.customerEmail.toLowerCase() !== email.toLowerCase()
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment session does not belong to this order.",
        });
      }

      const expectedSubtotal = pricedItems.reduce(
        (sum, it) => sum + it.unitPrice * Number(it.quantity),
        0
      );
      const expectedShipping = expectedSubtotal >= 150 ? 0 : 9.99;
      const expectedTax = expectedSubtotal * 0.1;
      const expectedTotal = expectedSubtotal + expectedShipping + expectedTax;
      const sessionAmount = Number(session.amount);
      if (Math.abs(sessionAmount - expectedTotal) > 0.01) {
        return res
          .status(400)
          .json({ success: false, message: "Payment amount does not match the order total. Please contact support." });
      }

      isPaid = true;
    }

    type SavedItem = { productName: string; quantity: number; unitPrice: number; size: string };

    let saved: SavedItem[];
    try {
      saved = await db.transaction(async (tx) => {
        const rows: SavedItem[] = [];

        if (paymentSessionId && paymentMethod !== "Cash on Delivery") {
          const claimed = await tx
            .update(paymentSessions)
            .set({ used: true })
            .where(
              and(
                eq(paymentSessions.sessionId, paymentSessionId),
                sql`COALESCE(${paymentSessions.used}, false) = false`
              )
            )
            .returning({ id: paymentSessions.id });

          if (claimed.length === 0) {
            throw new Error("This payment has already been used for an order.");
          }
        }

        for (const item of pricedItems) {
          const quantity = Number(item.quantity);

          if (item.productId) {
            const updated = await tx
              .update(products)
              .set({
                stock: sql`COALESCE(${products.stock}, 0) - ${quantity}`,
              })
              .where(
                and(
                  eq(products.id, item.productId),
                  sql`COALESCE(${products.active}, true) = true`,
                  sql`COALESCE(${products.stock}, 0) >= ${quantity}`
                )
              )
              .returning({ id: products.id });

            if (updated.length === 0) {
              throw new Error(`${item.productName} is out of stock`);
            }
          }

          const row = await tx
            .insert(product)
            .values({
              name,
              email,
              address,
              city,
              postalcode: postalCode,
              phone,
              quantity: String(quantity),
              productName: item.productName,
              price: String(item.unitPrice),
              size: item.size || "One Size",
              orderId,
              orderDate,
              status: "Pending",
              paymentMethod,
              isPaid,
            })
            .returning();

          rows.push({
            productName: item.productName,
            quantity,
            unitPrice: item.unitPrice,
            size: row[0].size || item.size || "One Size",
          });
        }

        return rows;
      });
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: (err as Error).message });
    }

    const subtotal = saved.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 9.99;
    const tax = subtotal * 0.1;

    await sendEmail(req, {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation ${orderId}`,
      html: `<h2>Hello ${escapeHtml(name)},</h2>
             <p>Thank you for your order <b>${escapeHtml(orderId)}</b>.</p>
             <table border="1" cellpadding="6" cellspacing="0">
               <tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
               ${saved
                 .map(
                   (i) =>
                     `<tr><td>${escapeHtml(i.productName)}</td><td>${escapeHtml(
                       i.size
                     )}</td><td>${i.quantity}</td><td>$${i.unitPrice.toFixed(
                       2
                     )}</td><td>$${(i.unitPrice * i.quantity).toFixed(2)}</td></tr>`
                 )
                 .join("")}
             </table>
             <p><b>Subtotal:</b> $${subtotal.toFixed(2)}<br/>
             <b>Shipping:</b> ${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}<br/>
             <b>Tax:</b> $${tax.toFixed(2)}<br/>
             <b>Total:</b> $${(subtotal + shipping + tax).toFixed(2)}</p>
             <p><b>Payment Method:</b> ${escapeHtml(paymentMethod)}<br/>
             <b>Payment Status:</b> ${isPaid ? "Paid" : "Pending payment"}${
        paymentTxnId && isPaid ? `<br/> <b>Transaction ID:</b> ${escapeHtml(paymentTxnId)}` : ""
      }</p>
             <p><b>Ship to:</b> ${escapeHtml(address)}, ${escapeHtml(city)} ${escapeHtml(
        postalCode
      )}</p>`,
    });

    res.json({
      success: true,
      message: "Order placed successfully!",
      data: { orderId },
    });
  })
);

export default router;