import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { and, asc, eq, type SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { college } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAdmin } from "../utils/requireAdmin.js";

const router = Router();

const collegeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  location: z.string().max(255).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  features: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return null;
      return typeof v === "string" ? v : v.join(",");
    }),
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
    const conditions: SQL[] = [];

    if (req.query.active === "true" || req.query.active === "false") {
      conditions.push(eq(college.active, req.query.active === "true"));
    }

    const rows = await db
      .select()
      .from(college)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(college.id));

    const items = rows.map((r) => ({
      ...r,
      features: r.features ? r.features.split(",") : [],
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
        .json({ success: false, message: "Invalid college id" });
    }
    const rows = await db
      .select()
      .from(college)
      .where(eq(college.id, id));
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }
    const r = rows[0];
    res.json({
      success: true,
      data: {
        ...r,
        features: r.features ? r.features.split(",") : [],
      },
    });
  })
);

router.post(
  "/",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = collegeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    const inserted = await db
      .insert(college)
      .values(data)
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
        .json({ success: false, message: "Invalid college id" });
    }
    const parsed = collegeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    await db.update(college).set(data).where(eq(college.id, id));
    const rows = await db
      .select()
      .from(college)
      .where(eq(college.id, id));
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
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
        .json({ success: false, message: "Invalid college id" });
    }
    await db.delete(college).where(eq(college.id, id));
    res.json({ success: true, message: "College deleted" });
  })
);

router.post(
  "/seed",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const existing = await db.select().from(college);
    if (existing.length > 0) {
      return res.json({ success: true, message: "Colleges already seeded" });
    }

    const seeds = [
      {
        name: "SkyWings Flight Academy – Kathmandu, Nepal",
        location: "Kathmandu, Nepal",
        image: "/pil.jpg",
        description: null,
        features: "DGCA- and EASA-approved curriculum,Modern fleet of Cessna and Piper aircraft,State-of-the-art full-motion flight simulators,Average CPL completion: 14 months",
        active: true,
      },
      {
        name: "Blue Horizon Aviation – Bangalore, India",
        location: "Bangalore, India",
        image: "/yuu.jpg",
        description: null,
        features: "Integrated PPL + CPL program,200+ international airline alumni,On-campus accommodation and cafeteria",
        active: true,
      },
    ];

    await db.insert(college).values(seeds);
    res.json({ success: true, message: "Colleges seeded successfully" });
  })
);

export default router;
