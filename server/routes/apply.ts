import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { apply } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const applySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  program: z.string().min(1, "Program is required"),
  college: z.string().min(1, "College is required"),
  message: z.string().optional(),
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { name, email, phone, program, college, message } = parsed.data;
    const createdAt = new Date().toISOString();
    const result = await db
      .insert(apply)
      .values({
        name,
        email,
        phoneNum: phone,
        program,
        college,
        message: message || null,
        createdAt,
      })
      .returning();

    res.json({ success: true, user: result[0] });
  })
);

export default router;