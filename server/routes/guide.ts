import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { guide } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAdmin } from "../utils/requireAdmin.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GUIDES_DIR = path.resolve(__dirname, "../../uploads/guides");
fs.mkdirSync(GUIDES_DIR, { recursive: true });

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, GUIDES_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  },
});

const uploadPdf = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    const err = new Error("Invalid file type. Only PDF files are allowed.") as Error & {
      statusCode: number;
    };
    err.statusCode = 400;
    cb(err);
  },
});

interface GuideChapter {
  heading: string;
  body?: string;
  items: string[];
}

const chapterSchema = z.object({
  heading: z.string().min(1).max(500),
  body: z.string().max(20000).optional(),
  items: z.array(z.string().max(5000)).optional(),
});

const VALID_CATEGORIES = ["guide", "course", "questions", "tips"] as const;
type GuideCategory = (typeof VALID_CATEGORIES)[number];

const isCategory = (v: unknown): v is GuideCategory =>
  typeof v === "string" && (VALID_CATEGORIES as readonly string[]).includes(v);

const guideSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  subtitle: z.string().max(5000).optional().nullable(),
  category: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === null || !v.trim()) return "guide";
      return isCategory(v) ? v : "guide";
    }),
  chapters: z
    .union([z.array(chapterSchema), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return null;
      if (typeof v === "string") {
        if (!v.trim()) return null;
        try {
          return JSON.stringify(JSON.parse(v));
        } catch {
          return null;
        }
      }
      return JSON.stringify(v);
    }),
  pdfUrl: z.string().max(500).optional().nullable(),
  active: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return true;
      return v === true || v === "true" || v === "1";
    }),
});

const parseChapters = (raw: string | null): GuideChapter[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const serializeGuide = (r: typeof guide.$inferSelect) => ({
  id: r.id,
  title: r.title,
  subtitle: r.subtitle,
  chapters: parseChapters(r.chapters),
  category: (VALID_CATEGORIES as readonly string[]).includes(r.category ?? "")
    ? (r.category as GuideCategory)
    : "guide",
  pdfUrl: r.pdfUrl ? `${BACKEND_URL}/api/guide/${r.id}/pdf` : null,
  active: r.active !== false,
  updatedAt: r.updatedAt,
});

// Public: list guides (all, so admin can manage; consumers filter by active)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const rows = await db.select().from(guide);
    res.json({ success: true, data: rows.map(serializeGuide) });
  })
);

// Public: fetch the active guide for a given section/category
router.get(
  "/byCategory/:category",
  asyncHandler(async (req: Request, res: Response) => {
    const category = String(req.params.category || "");
    if (!isCategory(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    const rows = await db.select().from(guide).where(eq(guide.category, category));
    const active = rows.find((r) => r.active !== false);
    if (!active) {
      return res.status(404).json({ success: false, message: "No content yet" });
    }
    res.json({ success: true, data: serializeGuide(active) });
  })
);

// Public: single guide
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid guide id" });
    }
    const rows = await db.select().from(guide).where(eq(guide.id, id));
    if (!rows.length || rows[0].active === false) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }
    res.json({ success: true, data: serializeGuide(rows[0]) });
  })
);

// Public: download PDF version of a guide
router.get(
  "/:id/pdf",
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid guide id" });
    }
    const rows = await db.select().from(guide).where(eq(guide.id, id));
    if (!rows.length || rows[0].active === false || !rows[0].pdfUrl) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }
    const filePath = path.resolve(GUIDES_DIR, rows[0].pdfUrl);
    if (!filePath.startsWith(GUIDES_DIR) || !fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${rows[0].pdfUrl}"`);
    res.sendFile(filePath);
  })
);

const removeStoredPdf = (filename: string | null): void => {
  if (!filename) return;
  try {
    const filePath = path.resolve(GUIDES_DIR, filename);
    if (filePath.startsWith(GUIDES_DIR) && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // ignore
  }
};

// Admin: create guide (accepts JSON body or multipart with optional pdf file)
router.post(
  "/",
  verifyAdmin,
  uploadPdf.single("pdf"),
  asyncHandler(async (req: Request, res: Response) => {
    const body = { ...req.body };
    if (req.file) body.pdfUrl = req.file.filename;
    const parsed = guideSchema.safeParse(body);
    if (!parsed.success) {
      if (req.file) removeStoredPdf(req.file.filename);
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    const inserted = await db
      .insert(guide)
      .values({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    res.json({ success: true, data: serializeGuide(inserted[0]) });
  })
);

// Admin: update guide
router.put(
  "/:id",
  verifyAdmin,
  uploadPdf.single("pdf"),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid guide id" });
    }
    const existing = await db.select().from(guide).where(eq(guide.id, id));
    if (!existing.length) {
      if (req.file) removeStoredPdf(req.file.filename);
      return res.status(404).json({ success: false, message: "Guide not found" });
    }
    const body = { ...req.body };
    if (req.file) body.pdfUrl = req.file.filename;
    const parsed = guideSchema.safeParse(body);
    if (!parsed.success) {
      if (req.file) removeStoredPdf(req.file.filename);
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }
    const data = parsed.data;
    if (req.file && existing[0].pdfUrl && existing[0].pdfUrl !== req.file.filename) {
      removeStoredPdf(existing[0].pdfUrl);
    }
    await db
      .update(guide)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(guide.id, id));
    const rows = await db.select().from(guide).where(eq(guide.id, id));
    res.json({ success: true, data: serializeGuide(rows[0]) });
  })
);

// Admin: delete guide
router.delete(
  "/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid guide id" });
    }
    const rows = await db.select().from(guide).where(eq(guide.id, id));
    if (rows.length) {
      removeStoredPdf(rows[0].pdfUrl);
      await db.delete(guide).where(eq(guide.id, id));
    }
    res.json({ success: true, message: "Guide deleted" });
  })
);

const SEED_CONTENT: Record<
  GuideCategory,
  { title: string; subtitle: string; chapters: { heading: string; body?: string; items?: string[] }[] }
> = {
  guide: {
    title: "Cabin Crew Training Guide — Become Interview Ready",
    subtitle:
      "A complete book-style guide for grooming, communication, aviation etiquette, interview tips & sample answers.",
    chapters: [
      {
        heading: "Chapter 1 — Grooming & Professional Appearance",
        body: "Grooming is the first thing recruiters notice — even before you speak. Cabin crew are the face of the airline, so appearance must reflect discipline, hygiene and confidence.",
        items: [
          "Neat and tidy hair; no flyaways",
          "Subtle & natural makeup for females — professional shave for males",
          "Well-fitted formal clothes (navy / white / black)",
          "Good posture, soft smile, and professional elegance",
        ],
      },
      {
        heading: "Chapter 2 — Communication & Aviation Etiquette",
        body: "Airlines observe how you speak, listen, and interact. Communication must be polite, calm and confident — especially under pressure.",
        items: [
          "Speak slowly and clearly — no filler words (umm, ahh, etc.)",
          "Use formal and respectful greetings",
          "Maintain eye contact but not aggressively",
          "Listen patiently before answering",
          "Never interrupt the interviewer or passengers",
        ],
      },
      {
        heading: "Chapter 3 — Purpose of Cabin Crew",
        body: "Many candidates think cabin crew is mainly hospitality — but safety is the main responsibility. Hospitality comes after safety and security protocols.",
        items: [
          "Handle onboard emergencies",
          "Follow safety procedures & briefings",
          "Reassure and calm passengers",
          "Provide professional and friendly customer service",
        ],
      },
      {
        heading: "Chapter 4 — Most Important Interview Question",
        body: "Q: Why should we hire you as a cabin crew?\n\n\"You should hire me because I genuinely enjoy helping people. I stay calm in stressful situations and work well in a team. I quickly adapt to new environments and represent the airline with confidence, respect and professionalism. I believe every passenger deserves a pleasant flying experience — and I am committed to that.\"",
        items: [],
      },
      {
        heading: "Chapter 5 — Frequent Mistakes Candidates Make",
        items: [
          "Walking in with no smile / nervous body language",
          "Memorizing answers instead of speaking naturally",
          "Wearing heavy perfume, dark lipstick or flashy accessories",
          "Talking too much instead of answering precisely",
          "Not researching about the airline",
        ],
      },
      {
        heading: "Chapter 6 — Aviation Behaviour & First Impression",
        body: "The interview begins the moment you enter the room — not when you sit. Your walk, smile, confidence and politeness build the first impression.",
        items: [
          "Knock softly → greet politely → take permission to sit",
          "Be calm and graceful while speaking",
          "Smile naturally but not continuously",
          "Always thank the interviewer before leaving",
        ],
      },
      {
        heading: "Final Message from the Aviation Industry",
        body: "Becoming a cabin crew is not about perfection — it is about progress. If you focus on grooming, communication, confidence and calmness, you will stand out automatically. Believe in yourself, practice daily and act like the professional you dream to become.",
        items: [],
      },
    ],
  },
  course: {
    title: "Cabin Crew Interview Mastery Course",
    subtitle:
      "Learn everything needed to crack your Dream Airline Interview on the FIRST attempt.",
    chapters: [
      {
        heading: "What You Will Learn",
        items: [
          "Complete introduction to airline recruitment process",
          "How to behave professionally during recruitment",
          "How to answer personal & situational questions",
          "Group discussion training & real examples",
          "Personality development & confidence building",
          "Resume/CV & grooming training included",
        ],
      },
      {
        heading: "Course Modules",
        items: [
          "Module 1 — Introduction to Cabin Crew Industry",
          "Module 2 — Communication & Body Language",
          "Module 3 — Personal HR Questions",
          "Module 4 — Final Interview Questions",
          "Module 5 — Safety, First Aid & Aviation Knowledge",
          "Module 6 — Final Evaluation & Certification",
        ],
      },
    ],
  },
  questions: {
    title: "Cabin Crew Interview Questions & Sample Answers",
    subtitle:
      "Frequently asked questions in real airline interviews — with expert answers.",
    chapters: [
      {
        heading: "1. Tell me about yourself.",
        body: "Interviewers want confidence, personality and professionalism — not your life story. Focus on your background, passion and skills relevant to aviation.",
        items: [
          '"My name is… I\'m a confident communicator with a passion for customer service. I enjoy helping people and adapting to new environments. I stay calm under pressure, work well in a team, and I am excited to represent the airline professionally while ensuring passengers feel valued and safe."',
        ],
      },
      {
        heading: "2. Why do you want to become a cabin crew?",
        body: "The answer must include: passion, service mindset, teamwork and emotional stability.",
        items: [
          '"I want to become a cabin crew because I enjoy serving people and creating positive travel experiences. I work well under pressure, communicate calmly in challenging situations and adapt quickly to new environments. I am motivated by teamwork and would be proud to represent the airline\'s values with professionalism and care."',
        ],
      },
      {
        heading: "3. What is good customer service?",
        body: "Airlines observe maturity, empathy and awareness of passenger expectations.",
        items: [
          '"Good customer service means making every passenger feel respected, safe and cared for. It includes listening patiently, communicating clearly, solving issues calmly and maintaining professionalism even under stress. Small acts of kindness create memorable flying experiences."',
        ],
      },
      {
        heading: "4. How do you handle an angry or difficult passenger?",
        body: "Interviewers want to see calmness, teamwork and passenger safety awareness.",
        items: [
          '"I would remain calm and polite, listen without interrupting and acknowledge their concern. I would apologize for the inconvenience and offer solutions within safety guidelines. If needed, I would involve the senior crew to ensure the situation is handled smoothly while staying professional throughout the interaction."',
        ],
      },
      {
        heading: "5. What does teamwork mean to you?",
        items: [
          '"Teamwork means supporting each other to achieve a smooth and safe flight. Onboard situations change quickly, so helping colleagues, communicating clearly and remaining positive ensures the best experience for passengers and crew."',
        ],
      },
      {
        heading: "6. Why should we hire you?",
        items: [
          '"You should hire me because I genuinely care about people, stay calm under pressure, communicate clearly and work well in a team. I am committed to representing the airline with professionalism, warmth and responsibility toward passengers\' safety and comfort."',
        ],
      },
    ],
  },
  tips: {
    title: "Cabin Crew Interview Tips",
    subtitle: "Professional guidance to help you pass the interview on your first attempt.",
    chapters: [
      {
        heading: "1. First Impression Matters",
        body: "Your appearance and body language create your reputation before you even speak. Maintain a warm smile, walk confidently, greet politely, and stay calm.",
        items: ["Interviewers decide 70% of your impression within the first 10 seconds."],
      },
      {
        heading: "2. Speak Confidently",
        body: "Use a clear tone, maintain natural speed, and keep your sentences short. Avoid fillers like \"umm\", \"ahh\", \"like\", \"you know\".",
        items: ["Practice your introduction daily in front of a mirror or camera."],
      },
      {
        heading: "3. Maintain Eye Contact",
        body: "Eye contact shows confidence and honesty. Do not stare — look natural, calm, and friendly while answering.",
      },
      {
        heading: "4. Master Situational Questions",
        body: "Cabin crew interviews include real-life situations such as handling a rude passenger, medical emergency, crying baby, or seat dispute.",
        items: [
          "Use the STAR Method: Situation – Task – Action – Result to structure your answers in a professional way.",
        ],
      },
      {
        heading: "5. Know About the Airline",
        body: "Research the airline before the interview. Learn about its destinations, aircraft type, slogan, awards, CEO, and customer service values.",
      },
      {
        heading: "6. Smile and Stay Positive — Even if You Make Mistakes",
        body: "Interviewers observe emotional stability — not perfection. A calm and positive attitude is more valuable than a perfect answer.",
      },
      {
        heading: "Mini Checklist Before Interview",
        items: [
          "Neat grooming and fresh appearance",
          "Formal and well-fitting outfit",
          "Soft makeup and minimal accessories (if applicable)",
          "Updated CV in a professional folder",
          "Comfortable formal shoes",
          "Printed passport copy (if available)",
          "Practice introduction & \"Why should we hire you?\"",
        ],
      },
    ],
  },
};

// Admin: seed the default content for all 4 interview sections
router.post(
  "/seed",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const now = new Date().toISOString();
    const created: (typeof guide.$inferSelect)[] = [];

    for (const category of VALID_CATEGORIES) {
      const existing = await db
        .select()
        .from(guide)
        .where(eq(guide.category, category));
      if (existing.length > 0) {
        continue;
      }
      const content = SEED_CONTENT[category];
      const inserted = await db
        .insert(guide)
        .values({
          title: content.title,
          subtitle: content.subtitle,
          category,
          chapters: JSON.stringify(content.chapters),
          active: true,
          updatedAt: now,
        })
        .returning();
      created.push(inserted[0]);
    }

    res.json({
      success: true,
      message: `Seeded ${created.length} section(s). Use the Guide tab to edit any section.`,
      data: created.map(serializeGuide),
    });
  })
);

// Admin: seed a single category
router.post(
  "/seed/:category",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const category = String(req.params.category || "");
    if (!isCategory(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    const existing = await db
      .select()
      .from(guide)
      .where(eq(guide.category, category));
    if (existing.length > 0) {
      return res.json({ success: true, message: `${category} guide already seeded` });
    }
    const content = SEED_CONTENT[category];
    const inserted = await db
      .insert(guide)
      .values({
        title: content.title,
        subtitle: content.subtitle,
        category,
        chapters: JSON.stringify(content.chapters),
        active: true,
        updatedAt: new Date().toISOString(),
      })
      .returning();
    res.json({ success: true, data: serializeGuide(inserted[0]) });
  })
);

export default router;
