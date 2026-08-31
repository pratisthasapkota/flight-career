import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { employeeInterest } from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const interestSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().min(1, "Phone is required").max(50),
  role: z.string().min(1, "Role is required").max(100),
  message: z.string().max(5000).optional(),
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = interestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { name, email, phone, role, message } = parsed.data;
    const createdAt = new Date().toISOString();

    const result = await db
      .insert(employeeInterest)
      .values({
        name,
        email,
        phone,
        role,
        message: message || null,
        createdAt,
      })
      .returning();

    res.status(201).json({ success: true, data: result[0] });
  })
);

export default router;