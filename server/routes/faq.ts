import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { faq } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAdmin } from "../utils/requireAdmin.js";

const router = Router();

const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required"),
  active: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return true;
      return v === true || v === "true" || v === "1";
    }),
  sortOrder: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null || v === "") return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }),
});

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(faq)
      .where(eq(faq.active, true))
      .orderBy(asc(faq.sortOrder), asc(faq.id));
    res.json({ success: true, data: rows });
  })
);

router.get(
  "/all",
  verifyAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const rows = await db
      .select()
      .from(faq)
      .orderBy(asc(faq.sortOrder), asc(faq.id));
    res.json({ success: true, data: rows });
  })
);

router.post(
  "/",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const inserted = await db.insert(faq).values(parsed.data).returning();
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
        .json({ success: false, message: "Invalid FAQ id" });
    }
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    await db.update(faq).set(parsed.data).where(eq(faq.id, id));
    const rows = await db.select().from(faq).where(eq(faq.id, id));
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "FAQ not found" });
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
        .json({ success: false, message: "Invalid FAQ id" });
    }
    await db.delete(faq).where(eq(faq.id, id));
    res.json({ success: true, message: "FAQ deleted" });
  })
);

router.post(
  "/seed",
  verifyAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const existing = await db.select().from(faq);
    if (existing.length > 0) {
      return res.json({ success: true, message: "FAQs already seeded" });
    }

    const seeds = [
      { question: "What qualifications do I need to become a cabin crew member?", answer: "Most airlines require a minimum age of 18-21, a high school diploma, proficiency in English, and excellent physical fitness. Additional certifications like a cabin crew training certificate are often preferred.", sortOrder: 1 },
      { question: "How long does pilot training take?", answer: "Pilot training duration varies. A Private Pilot License (PPL) takes about 2-3 months, while a Commercial Pilot License (CPL) can take 6-18 months. An Airline Transport Pilot License (ATPL) requires additional flight hours and can take 2-3 years total.", sortOrder: 2 },
      { question: "Does AeroCareers provide job placement assistance?", answer: "Yes! We partner with multiple airlines and aviation companies to provide job placement assistance to our trained students. Our career services team helps with resume preparation, interview coaching, and connecting you with hiring partners.", sortOrder: 3 },
      { question: "What training programs do you offer?", answer: "We offer comprehensive training programs including Pilot Training (PPL, CPL, ATPL), Cabin Crew Certification, Aircraft Maintenance Engineering, Flight Operations, and various short courses for aviation professionals.", sortOrder: 4 },
      { question: "Are there scholarships available?", answer: "Yes, we offer merit-based scholarships and flexible payment plans for qualifying students. Contact our admissions team to learn more about available financial aid options.", sortOrder: 5 },
      { question: "Can I work internationally after training?", answer: "Absolutely! Aviation is a global industry. Our certifications are recognized internationally, and many of our graduates work with airlines across Asia, the Middle East, Europe, and the Americas.", sortOrder: 6 },
      { question: "What is the career growth path for cabin crew?", answer: "A typical cabin crew career path includes: Cabin Crew \u2192 Senior Cabin Crew \u2192 Cabin Crew Trainer \u2192 In-Flight Services Manager \u2192 Head of In-Flight Services. With additional qualifications, some transition to ground-based roles.", sortOrder: 7 },
      { question: "How do I apply for job vacancies?", answer: "Visit our Vacancies page to see current openings. You can apply directly through the application links provided for each airline. We recommend setting up email alerts to stay updated on new opportunities.", sortOrder: 8 },
    ];

    await db.insert(faq).values(seeds);
    res.json({ success: true, message: "FAQs seeded successfully" });
  })
);

export default router;
