import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notify } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const notifySchema = z.object({
  email: z.string().email("Invalid email").max(255),
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = notifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await db.select().from(notify).where(eq(notify.email, email));
    if (existing.length > 0) {
      return res
        .status(200)
        .json({ message: "This email is already subscribed", data: existing[0] });
    }

    const result = await db.insert(notify).values({ email }).returning();
    res.status(201).json({ message: "Email saved", data: result[0] });
  })
);

export default router;