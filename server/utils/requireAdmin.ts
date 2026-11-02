import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { login, users } from "../db/schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const safeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(String(a || ""));
  const bufB = Buffer.from(String(b || ""));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

async function findAdminRecord(email: string) {
  const loginRows = await db
    .select({ id: login.id, email: login.email, isAdmin: login.isAdmin })
    .from(login)
    .where(eq(login.email, email));

  if (loginRows.length > 0) {
    return loginRows[0];
  }

  const userRows = await db
    .select({ id: users.id, email: users.email, isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.email, email));

  return userRows.length > 0 ? userRows[0] : null;
}

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers.authorization || "";
  const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = req.cookies?.admin_token || null;
  const token = headerToken || cookieToken;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (cookieToken && !CSRF_SAFE_METHODS.has(req.method)) {
    const expected = req.cookies?.admin_csrf || "";
    const provided = Array.isArray(req.headers["x-csrf-token"])
      ? req.headers["x-csrf-token"][0]
      : req.headers["x-csrf-token"] || "";
    if (!expected || !safeEqual(provided, expected)) {
      res
        .status(403)
        .json({ success: false, message: "Invalid or missing CSRF token" });
      return;
    }
  }

  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
    return;
  }

  const email =
    typeof decoded.email === "string" ? decoded.email.toLowerCase() : "";
  if (!email) {
    res.status(401).json({ success: false, message: "Invalid token payload" });
    return;
  }

  try {
    const record = await findAdminRecord(email);

    if (!record || record.isAdmin !== true) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    req.admin = {
      userId: record.id,
      email: record.email,
      role: "admin",
      iat: decoded.iat,
      exp: decoded.exp,
    };

    res.setHeader("Cache-Control", "no-store");
    next();
  } catch (err) {
    console.error("[admin] Authorization lookup failed:", (err as Error).message);
    res.status(500).json({ success: false, message: "Authorization check failed" });
  }
};
