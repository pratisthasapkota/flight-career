import { Router } from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { login, users } from "../db/schema.js";
import { sendEmail } from "../email.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_SAME_SITE =
  (process.env.COOKIE_SAME_SITE as "lax" | "none" | "strict" | undefined) ||
  (isProd ? "none" : "lax");

const setTokenCookie = (res: Response, token: string, maxAge: number): void => {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge,
    path: "/",
  });
};

const clearTokenCookie = (res: Response): void => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge: 0,
    path: "/",
  });
};

const signupSchema = z.object({
  email: z.string().email("Invalid email").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

router.post(
  "/sign",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const existing = await db
      .select()
      .from(login)
      .where(eq(login.email, normalizedEmail));
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email: normalizedEmail }, JWT_SECRET, { expiresIn: "1d" });
    const verifyURL = `${BACKEND_URL}/api/verify/${token}`;

    await db.insert(login).values({
      email: normalizedEmail,
      password: hashed,
      verified: false,
      verificationlink: token,
    });

    await sendEmail(req, {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Verify your email address",
      html: `<h2>Welcome!</h2>
             <p>Thanks for signing up. Please confirm your email address by clicking the link below:</p>
             <a href="${verifyURL}">${verifyURL}</a>
             <p>This link will expire in 24 hours.</p>`,
    });

    res.json({
      success: true,
      message: "Sign up successful! You can now log in.",
    });
  })
);

router.get(
  "/verify/:token",
  asyncHandler(async (req: Request, res: Response) => {
    const token = String(req.params.token);
    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .send("<h2>Invalid or expired verification link</h2>");
    }

    const email =
      typeof decoded === "string" ? decoded : (decoded as { email?: string }).email;

    if (!email) {
      return res.status(400).send("<h2>Invalid verification link</h2>");
    }

    const existing = await db
      .select()
      .from(login)
      .where(eq(login.email, email));

    if (existing.length > 0) {
      if (existing[0].verified) {
        return res.send("<h2>Your email is already verified!</h2>");
      }
      await db
        .update(login)
        .set({ verified: true, verificationlink: null })
        .where(eq(login.email, email));
      return res.send(`
        <html>
          <body>
            <h2>Email verified successfully!</h2>
            <p>You can now <a href="${CLIENT_URL}/login">login</a>.</p>
          </body>
        </html>
      `);
    }

    res.status(400).send("<h2>Invalid verification link</h2>");
  })
);

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const result = await db
      .select()
      .from(login)
      .where(eq(login.email, normalizedEmail));
    if (result.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = result[0];
    if (!user.verified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    setTokenCookie(res, token, 60 * 60 * 1000);
    res.status(200).json({
      success: true,
      user: { email: user.email, verified: user.verified },
    });
  })
);

router.get(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.auth_token || null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      clearTokenCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Session expired" });
    }

    const email =
      typeof decoded === "string" ? decoded : (decoded as { email?: string }).email;

    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const loginResult = await db
      .select()
      .from(login)
      .where(eq(login.email, email));

    if (loginResult.length > 0) {
      const user = loginResult[0];
      if (!user.verified) {
        return res
          .status(403)
          .json({ success: false, message: "Email not verified" });
      }

      const refreshedToken = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      setTokenCookie(res, refreshedToken, 60 * 60 * 1000);

      return res.status(200).json({
        success: true,
        user: { email: user.email, verified: user.verified },
      });
    }

    const googleResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (googleResult.length > 0) {
      const user = googleResult[0];
      const refreshedToken = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      setTokenCookie(res, refreshedToken, 60 * 60 * 1000);

      return res.status(200).json({
        success: true,
        user: { email: user.email, name: user.name },
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "User not found" });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    clearTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  })
);

export default router;