import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  apply,
  product,
  vacancy,
  vacancyApplication,
  login,
  employeeInterest,
} from "../db/schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload & { role?: string };
    if (decoded.role !== "admin") {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }
    req.admin = {
      email: String(decoded.email || ""),
      role: decoded.role || "admin",
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

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
    if (email !== ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );
    res.json({ success: true, token, message: "Admin logged in successfully" });
  })
);

router.get(
  "/applications",
  verifyAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const jobs = await db.select().from(apply);
    const orders = await db.select().from(product);
    const vacancyApps = await db.select().from(vacancyApplication);
    const vacancies = await db.select().from(vacancy);
    const users = await db.select().from(login);
    const interests = await db.select().from(employeeInterest);

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
      },
    });
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

export default router;