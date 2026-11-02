import { Router } from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { sniffFileType, RESUME_CONTENT_TYPES } from "../utils/fileType.js";
import {
  apply,
  product,
  vacancy,
  vacancyApplication,
  login,
  employeeInterest,
  notify,
} from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAdmin } from "../utils/requireAdmin.js";
import { sendEmail } from "../email.js";
import {
  loadPaymentSettings,
  savePaymentSettings,
} from "../utils/paymentSettings.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_SAME_SITE =
  (process.env.COOKIE_SAME_SITE as "lax" | "none" | "strict" | undefined) ||
  (isProd ? "none" : "lax");

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

const setAdminTokenCookie = (res: Response, token: string, maxAge: number): void => {
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge,
    path: "/",
  });
};

const clearAdminTokenCookie = (res: Response): void => {
  res.cookie("admin_token", "", {
    httpOnly: true,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge: 0,
    path: "/",
  });
};

const setCsrfCookie = (res: Response, token: string, maxAge: number): void => {
  res.cookie("admin_csrf", token, {
    httpOnly: false,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge,
    path: "/",
  });
};

const clearCsrfCookie = (res: Response): void => {
  res.cookie("admin_csrf", "", {
    httpOnly: false,
    secure: isProd || COOKIE_SAME_SITE === "none",
    sameSite: COOKIE_SAME_SITE,
    maxAge: 0,
    path: "/",
  });
};

const ADMIN_SESSION_MS = 24 * 60 * 60 * 1000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESUMES_DIR = path.resolve(__dirname, "../../uploads/resumes");

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const serializeOrder = (r: typeof product.$inferSelect) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  address: r.address,
  city: r.city,
  postalcode: r.postalcode,
  phone: r.phone,
  quantity: r.quantity,
  productName: r.productName,
  price: Number(r.price || 0),
  size: r.size || null,
  orderId: r.orderId || null,
  orderDate: r.orderDate || null,
  status: r.status || "Pending",
  paymentMethod: r.paymentMethod || "Cash on Delivery",
  isPaid: !!r.isPaid,
});

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = adminLoginSchema.safeParse(req.body);
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

    const user = result[0];
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !user.isAdmin || !passwordMatch) {
      console.error("[admin] Login failed: invalid credentials");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ success: false, message: "Admin account is not verified" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    setAdminTokenCookie(res, token, ADMIN_SESSION_MS);
    const csrfToken = crypto.randomBytes(32).toString("hex");
    setCsrfCookie(res, csrfToken, ADMIN_SESSION_MS);
    res.json({
      success: true,
      csrfToken,
      user: { id: user.id, email: user.email, isAdmin: true },
      message: "Admin logged in successfully",
    });
  })
);

router.get(
  "/session",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = jwt.sign(
      { sub: req.admin.userId, email: req.admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    setAdminTokenCookie(res, token, ADMIN_SESSION_MS);

    let csrfToken = req.cookies?.admin_csrf || "";
    if (!csrfToken) {
      csrfToken = crypto.randomBytes(32).toString("hex");
      setCsrfCookie(res, csrfToken, ADMIN_SESSION_MS);
    }

    res.json({
      success: true,
      user: {
        id: req.admin.userId,
        email: req.admin.email,
        isAdmin: true,
      },
      csrfToken,
    });
  })
);

router.get(
  "/resume/:filename",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const raw = String(req.params.filename || "");
    if (!raw) {
      return res.status(400).json({ success: false, message: "Filename required" });
    }
    if (!/^[A-Za-z0-9._-]+$/.test(raw)) {
      return res.status(400).json({ success: false, message: "Invalid filename" });
    }
    const filePath = path.resolve(RESUMES_DIR, raw);
    if (!filePath.startsWith(RESUMES_DIR)) {
      return res.status(400).json({ success: false, message: "Invalid path" });
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    const fileType = sniffFileType(filePath);
    if (!fileType) {
      return res.status(400).json({ success: false, message: "Resume file type not recognized" });
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", `attachment; filename="${raw}"`);
    res.sendFile(filePath, { headers: { "Content-Type": RESUME_CONTENT_TYPES[fileType] } });
  })
);

router.get(
  "/applications",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const [jobs, orders, vacancyApps, vacancies, users, interests, subscribers] =
      await Promise.all([
        db.select().from(apply).orderBy(desc(apply.createdAt)),
        db.select().from(product).orderBy(desc(product.orderDate)),
        db.select().from(vacancyApplication).orderBy(desc(vacancyApplication.createdAt)),
        db.select().from(vacancy).orderBy(desc(vacancy.id)),
        db
          .select({
            id: login.id,
            email: login.email,
            verified: login.verified,
            isAdmin: login.isAdmin,
          })
          .from(login)
          .orderBy(desc(login.id)),
        db.select().from(employeeInterest).orderBy(desc(employeeInterest.createdAt)),
        db.select().from(notify).orderBy(desc(notify.id)),
      ]);

    res.json({
      success: true,
      data: {
        jobApplications: jobs.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phoneNum,
          program: r.program,
          college: r.college,
          message: r.message,
          createdAt: r.createdAt,
        })),
        orders: orders.map(serializeOrder),
        vacancyApplications: vacancyApps.map((r) => ({
          id: r.id,
          vacancyId: r.vacancyId,
          name: r.name,
          email: r.email,
          phone: r.phone,
          resumeUrl: r.resumeUrl,
          coverLetter: r.coverLetter,
          createdAt: r.createdAt,
        })),
        vacancies: vacancies.map((r) => ({
          id: r.id,
          title: r.title,
          salary: r.salary,
          role: r.role,
          skills: r.skills,
          responsibilities: r.responsibilities,
          location: r.location,
          deadline: r.deadline,
        })),
        users: users.map((r) => ({
          id: r.id,
          email: r.email,
          verified: !!r.verified,
        })),
        employeeInterests: interests.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          role: r.role,
          message: r.message,
          createdAt: r.createdAt,
        })),
        subscribers: subscribers.map((r) => ({
          id: r.id,
          email: r.email,
        })),
      },
    });
  })
);

router.post(
  "/users/:id/resend-verification",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const result = await db.select().from(login).where(eq(login.id, id));
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = result[0];
    if (user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    const verifyURL = `${BACKEND_URL}/api/verify/${token}`;

    await db
      .update(login)
      .set({ verificationlink: token })
      .where(eq(login.id, id));

    await sendEmail(req, {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify your email address",
      html: `<h2>Hi there!</h2>
             <p>Please confirm your email address by clicking the link below:</p>
             <a href="${verifyURL}">${verifyURL}</a>
             <p>This link will expire in 24 hours.</p>`,
    });

    res.json({ success: true, message: "Verification email sent" });
  })
);

router.delete(
  "/users/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const target = await db.select().from(login).where(eq(login.id, id));
    if (target.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const deleteUserId = target[0].id;

    const targetEmail = target[0].email.toLowerCase();
    const requesterEmail = String(req.admin?.email || "").toLowerCase();
    if (targetEmail === requesterEmail) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own admin account" });
    }

    await db.delete(login).where(eq(login.id, deleteUserId));

    res.json({ success: true, message: "User deleted successfully" });
  })
);

router.put(
  "/orders/:orderId/status",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = z.object({ status: z.string().min(1) }).safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }
    const orderId = String(req.params.orderId);
    const { status } = parsed.data;

    if (orderId.startsWith("#")) {
      await db
        .update(product)
        .set({ status })
        .where(eq(product.id, Number(orderId.slice(1))));
    } else {
      await db
        .update(product)
        .set({ status })
        .where(eq(product.orderId, orderId));
    }
    res.json({ success: true, message: "Order status updated" });
  })
);

router.put(
  "/orders/:orderId/payment",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = z
      .object({ isPaid: z.boolean() })
      .safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }
    const orderId = String(req.params.orderId);
    const { isPaid } = parsed.data;

    if (orderId.startsWith("#")) {
      await db
        .update(product)
        .set({ isPaid })
        .where(eq(product.id, Number(orderId.slice(1))));
    } else {
      await db
        .update(product)
        .set({ isPaid })
        .where(eq(product.orderId, orderId));
    }
    res.json({ success: true, message: "Payment status updated" });
  })
);

router.delete(
  "/orders/:orderId",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (String(orderId).startsWith("#")) {
      await db
        .delete(product)
        .where(eq(product.id, Number(String(orderId).slice(1))));
    } else {
      await db.delete(product).where(eq(product.orderId, String(orderId)));
    }
    res.json({ success: true, message: "Order deleted" });
  })
);

router.delete(
  "/subscribers/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subscriber id" });
    }

    const target = await db.select().from(notify).where(eq(notify.id, id));
    if (target.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found" });
    }

    await db.delete(notify).where(eq(notify.id, id));

    res.json({ success: true, message: "Subscriber deleted successfully" });
  })
);

router.delete(
  "/vacancy-applications/:id",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid application id" });
    }

    const target = await db.select().from(vacancyApplication).where(eq(vacancyApplication.id, id));
    if (target.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    await db.delete(vacancyApplication).where(eq(vacancyApplication.id, id));

    res.json({ success: true, message: "Application deleted successfully" });
  })
);

router.get(
  "/payment-settings",
  verifyAdmin,
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await loadPaymentSettings();
    res.json({ success: true, data: settings });
  })
);

router.put(
  "/payment-settings",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = z
      .object({
        mode: z.enum(["demo", "khalti", "live"]),
        enabledMethods: z.array(z.string().min(1)).min(1),
        khaltiPublicKey: z.string().optional().nullable(),
        khaltiSecretKey: z.string().optional().nullable(),
        esewaMerchantId: z.string().optional().nullable(),
        esewaSecretKey: z.string().optional().nullable(),
        fonepayMerchantId: z.string().optional().nullable(),
        fonepaySecretKey: z.string().optional().nullable(),
      })
      .safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const settings = await savePaymentSettings({
      mode: parsed.data.mode === "khalti" ? "live" : parsed.data.mode,
      enabledMethods: parsed.data.enabledMethods,
      khaltiPublicKey: parsed.data.khaltiPublicKey,
      khaltiSecretKey: parsed.data.khaltiSecretKey,
      esewaMerchantId: parsed.data.esewaMerchantId,
      esewaSecretKey: parsed.data.esewaSecretKey,
      fonepayMerchantId: parsed.data.fonepayMerchantId,
      fonepaySecretKey: parsed.data.fonepaySecretKey,
    });

    res.json({ success: true, message: "Payment settings saved", data: settings });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    clearAdminTokenCookie(res);
    clearCsrfCookie(res);
    res.json({ success: true, message: "Admin logged out successfully" });
  })
);

export default router;