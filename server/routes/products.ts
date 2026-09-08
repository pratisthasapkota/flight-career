import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
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

      const expectedSubtotal = items.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.quantity),
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

    const saved: SavedItem[] = await db.transaction(async (tx) => {
      const rows: SavedItem[] = [];
      for (const item of items) {
        const quantity = Number(item.quantity);

        if (item.productId) {
          const catalog = await tx
            .select()
            .from(products)
            .where(eq(products.id, item.productId));
          if (catalog.length === 0 || catalog[0].active === false) {
            throw new Error("Product is no longer available");
          }
          const stock = catalog[0].stock ?? 0;
          if (stock <= 0) {
            throw new Error(`${catalog[0].name} is out of stock`);
          }
          if (quantity > stock) {
            throw new Error(`Only ${stock} units of ${catalog[0].name} are available`);
          }

          const unitPrice = Number(catalog[0].price || 0);
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
              productName: item.productname,
              price: String(unitPrice),
              size: item.size || "One Size",
              orderId,
              orderDate,
              status: "Pending",
              paymentMethod,
              isPaid,
            })
            .returning();

          await tx
            .update(products)
            .set({ stock: stock - quantity })
            .where(eq(products.id, item.productId));

          rows.push({
            productName: item.productname,
            quantity,
            unitPrice,
            size: row[0].size || item.size || "One Size",
          });
        } else {
          const unitPrice = Number(item.price ?? 0);
          if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error("Invalid price for custom item");
          }
          await tx
            .insert(product)
            .values({
              name,
              email,
              address,
              city,
              postalcode: postalCode,
              phone,
              quantity: String(quantity),
              productName: item.productname,
              price: String(unitPrice),
              size: item.size || "One Size",
              orderId,
              orderDate,
              status: "Pending",
              paymentMethod,
              isPaid,
            })
            .returning();

          rows.push({
            productName: item.productname,
            quantity,
            unitPrice,
            size: item.size || "One Size",
          });
        }
      }
      return rows;
    });

    const subtotal = saved.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 9.99;
    const tax = subtotal * 0.1;

    if (paymentSessionId) {
      await db
        .update(paymentSessions)
        .set({ used: true })
        .where(eq(paymentSessions.sessionId, paymentSessionId));
    }

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