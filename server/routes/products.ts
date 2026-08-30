import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { product, products } from "../db/schema.js";
import { sendEmail } from "../email.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone is required"),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive().optional().nullable(),
        productname: z.string().min(1, "Product name is required"),
        quantity: z
          .union([z.string(), z.number()])
          .refine((v) => Number(v) >= 1, "Quantity must be at least 1"),
        price: z.union([z.string(), z.number()]).optional().nullable(),
        size: z.string().optional().nullable(),
      })
    )
    .min(1, "Order must contain at least one item"),
});

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

    const { name, email, address, city, postalCode, phone, items } = parsed.data;
    const orderId =
      "ORD-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderDate = new Date().toISOString();

    const saved: { productName: string; quantity: number; unitPrice: number; size: string }[] =
      [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.price ?? 0);

      const row = await db
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
        })
        .returning();

      saved.push({
        productName: row[0].productName || item.productname,
        quantity,
        unitPrice,
        size: row[0].size || item.size || "One Size",
      });

      if (item.productId) {
        try {
          const found = await db
            .select()
            .from(products)
            .where(eq(products.id, item.productId));
          if (found.length && (found[0].stock ?? 0) > 0) {
            await db
              .update(products)
              .set({ stock: Math.max(0, (found[0].stock ?? 0) - quantity) })
              .where(eq(products.id, item.productId));
          }
        } catch (err) {
          console.error("Stock update failed:", (err as Error).message);
        }
      }
    }

    const subtotal = saved.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 9.99;
    const tax = subtotal * 0.1;

    await sendEmail(req, {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation ${orderId}`,
      html: `<h2>Hello ${name},</h2>
             <p>Thank you for your order <b>${orderId}</b>.</p>
             <table border="1" cellpadding="6" cellspacing="0">
               <tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
               ${saved
                 .map(
                   (i) =>
                     `<tr><td>${i.productName}</td><td>${i.size}</td><td>${i.quantity}</td><td>$${i.unitPrice.toFixed(
                       2
                     )}</td><td>$${(i.unitPrice * i.quantity).toFixed(2)}</td></tr>`
                 )
                 .join("")}
             </table>
             <p><b>Subtotal:</b> $${subtotal.toFixed(2)}<br/>
             <b>Shipping:</b> ${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}<br/>
             <b>Tax:</b> $${tax.toFixed(2)}<br/>
             <b>Total:</b> $${(subtotal + shipping + tax).toFixed(2)}</p>
             <p><b>Ship to:</b> ${address}, ${city} ${postalCode}</p>`,
    });

    res.json({
      success: true,
      message: "Order placed successfully!",
      data: { orderId },
    });
  })
);

export default router;