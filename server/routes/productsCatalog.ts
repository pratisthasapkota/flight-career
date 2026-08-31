import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAdmin } from "../utils/requireAdmin.js";

const router = Router();

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.string().min(1, "Category is required").max(100),
  price: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v) && v >= 0, "Price must be a valid number"),
  image: z.string().min(1, "Image path is required").max(500),
  rating: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? 4.5 : Number(v)))
    .refine((v) => Number.isFinite(v) && v >= 0 && v <= 5, "Rating must be between 0 and 5"),
  reviews: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? 0 : Number(v)))
    .refine((v) => Number.isInteger(v) && v >= 0, "Reviews must be a non-negative integer"),
  badge: z.string().max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  sizes: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return null;
      return typeof v === "string" ? v : v.join(",");
    }),
  stock: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? 0 : Number(v)))
    .refine((v) => Number.isInteger(v) && v >= 0, "Stock must be a non-negative integer"),
  active: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return true;
      return v === true || v === "true" || v === "1";
    }),
});

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db.select().from(products);
    const items = rows.map((r) => ({
      ...r,
      price: Number(r.price),
      rating: Number(r.rating),
      sizes: r.sizes ? r.sizes.split(",") : [],
    }));
    res.json({ success: true, data: items });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const r = rows[0];
    res.json({
      success: true,
      data: {
        ...r,
        price: Number(r.price),
        rating: Number(r.rating),
        sizes: r.sizes ? r.sizes.split(",") : [],
      },
    });
  })
);

router.post(
  "/seed",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await db.select().from(products);
    if (existing.length > 0) {
      return res.json({ success: true, message: "Products already seeded" });
    }

    const seeds = [
      { name: "Pilot Uniform Set", image: "/r.png", price: 129.99, category: "Pilot", rating: 4.8, reviews: 124, badge: "Best Seller", description: "Professional pilot uniform with epaulets, shirt, tie, and trousers. IATA compliant.", sizes: ["S", "M", "L", "XL", "XXL"].join(","), stock: 25, active: true },
      { name: "Cabin Crew Dress", image: "/p.png", price: 109.99, category: "Cabin Crew", rating: 4.7, reviews: 98, badge: "Popular", description: "Elegant cabin crew dress designed for comfort and professionalism during long flights.", sizes: ["XS", "S", "M", "L", "XL"].join(","), stock: 30, active: true },
      { name: "Ground Staff Blazer", image: "/q.png", price: 99.99, category: "Ground Staff", rating: 4.5, reviews: 67, badge: null, description: "Sharp and professional ground staff blazer. Perfect for airport customer service roles.", sizes: ["S", "M", "L", "XL"].join(","), stock: 20, active: true },
      { name: "Flight Attendant Outfit", image: "/u.png", price: 119.99, category: "Cabin Crew", rating: 4.6, reviews: 85, badge: "New", description: "Complete flight attendant outfit with matching scarf and accessories.", sizes: ["XS", "S", "M", "L", "XL"].join(","), stock: 22, active: true },
      { name: "Blue Crew Set", image: "/v.png", price: 89.99, category: "Cabin Crew", rating: 4.4, reviews: 56, badge: null, description: "Budget-friendly cabin crew set ideal for training and fresh recruits.", sizes: ["S", "M", "L", "XL"].join(","), stock: 18, active: true },
      { name: "Formal Aviation Dress", image: "/dress.png", price: 139.99, category: "Cabin Crew", rating: 4.9, reviews: 142, badge: "Top Rated", description: "Premium formal dress for senior cabin crew and in-flight managers.", sizes: ["XS", "S", "M", "L"].join(","), stock: 15, active: true },
      { name: "Pilot Leather Jacket", image: "/r.png", price: 189.99, category: "Pilot", rating: 4.8, reviews: 73, badge: "Premium", description: "Classic aviator leather jacket. Durable, warm, and stylish for off-duty pilots.", sizes: ["S", "M", "L", "XL", "XXL"].join(","), stock: 12, active: true },
      { name: "Cabin Crew Training Kit", image: "/p.png", price: 59.99, category: "Accessories", rating: 4.3, reviews: 41, badge: null, description: "Essential training kit including grooming accessories, name badge, and guide.", sizes: ["One Size"].join(","), stock: 40, active: true },
      { name: "Airport Operations Polo", image: "/q.png", price: 49.99, category: "Ground Staff", rating: 4.2, reviews: 38, badge: null, description: "Comfortable polo shirt for ground operations and ramp staff.", sizes: ["S", "M", "L", "XL", "XXL"].join(","), stock: 35, active: true },
      { name: "Aviation Tie Set", image: "/u.png", price: 34.99, category: "Accessories", rating: 4.5, reviews: 92, badge: "Best Value", description: "Set of 3 aviation-themed ties. Perfect gift for aviation enthusiasts.", sizes: ["One Size"].join(","), stock: 50, active: true },
      { name: "Senior Crew Blazer", image: "/v.png", price: 159.99, category: "Cabin Crew", rating: 4.7, reviews: 64, badge: null, description: "Premium blazer for senior cabin crew with embroidered airline crest option.", sizes: ["XS", "S", "M", "L", "XL"].join(","), stock: 14, active: true },
      { name: "Pilot Cap & Badge Set", image: "/dress.png", price: 44.99, category: "Pilot", rating: 4.6, reviews: 108, badge: "Popular", description: "Official-style pilot cap with gold badge. A must-have accessory.", sizes: ["One Size"].join(","), stock: 45, active: true },
    ];

    const seedRows = seeds.map((s) => ({
      ...s,
      price: String(s.price),
      rating: String(s.rating),
    }));

    await db.insert(products).values(seedRows);
    res.json({ success: true, message: "Products seeded successfully" });
  })
);

router.post(
  "/",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    const record = {
      ...data,
      price: String(data.price),
      rating: String(data.rating),
    };
    const inserted = await db
      .insert(products)
      .values(record)
      .returning();
    res.json({ success: true, data: inserted[0] });
  })
);

router.put(
  "/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    const record = {
      ...data,
      price: String(data.price),
      rating: String(data.rating),
    };
    await db.update(products).set(record).where(eq(products.id, id));
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: rows[0] });
  })
);

router.delete(
  "/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }
    await db.delete(products).where(eq(products.id, id));
    res.json({ success: true, message: "Product deleted" });
  })
);

export default router;