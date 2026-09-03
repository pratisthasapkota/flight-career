import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization || "";
  const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = req.cookies?.admin_token || null;
  const token = headerToken || cookieToken;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
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
    res.setHeader("Cache-Control", "no-store");
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};