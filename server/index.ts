import "./env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import type { NextFunction, Request, Response } from "express";

import initializePassport, { handleGoogleCallback } from "./config/passport.js";
import { createTransporter } from "./email.js";

import authRoutes from "./routes/auth.js";
import vacanciesRoutes from "./routes/vacancies.js";
import adminRoutes from "./routes/admin.js";
import productsRoutes from "./routes/products.js";
import productsCatalogRoutes from "./routes/productsCatalog.js";
import applyRoutes from "./routes/apply.js";
import notifyRoutes from "./routes/notify.js";
import employeeInterestRoutes from "./routes/employeeInterest.js";
import collegesRoutes from "./routes/colleges.js";
import { ensureSchema } from "./db/ensureSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "5000", 10);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysecretkey123";
const JWT_SECRET = process.env.JWT_SECRET || "";
const CORS_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || CLIENT_URL)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const isProd = process.env.NODE_ENV === "production";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

// ---- Basic security & parsing ----
app.use(
  helmet({
    contentSecurityPolicy: isProd ? undefined : false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
    req.headers["content-type"] &&
    !req.headers["content-type"].toLowerCase().startsWith("application/json") &&
    !req.headers["content-type"].toLowerCase().startsWith("multipart/form-data")
  ) {
    return res
      .status(415)
      .json({ success: false, message: "Content-Type must be application/json" });
  }
  next();
});
app.use(
  express.json({
    limit: "100kb",
  })
);
app.use(cookieParser());

// ---- Rate limiting ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many admin requests, please try again later." },
});

app.use("/api", apiLimiter);

// ---- CORS ----
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  })
);

// ---- Sessions & Passport ----
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

const transporter = createTransporter();
app.set("transporter", transporter);

// ---- Google OAuth Routes ----

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/` }),
  (req: Request, res: Response) => {
    const authUser = req.user as Express.User | undefined;
    if (!authUser?.email) {
      return res.redirect(`${CLIENT_URL}/`);
    }
    const token = jwt.sign(
      { email: authUser.email, name: authUser.name },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    });
    res.redirect(`${CLIENT_URL}/call`);
  }
);

// Popup OAuth flow (used by @react-oauth/google on the client)
app.post("/auth/google/callback", authLimiter, handleGoogleCallback);

// ---- Route Modules (all API endpoints live under /api) ----

app.use("/auth", authLimiter);
app.use("/api/admin", adminLimiter);
app.use("/api", authRoutes);
app.use("/api/vacancies", vacanciesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productsRoutes);
app.use("/api/products", productsCatalogRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/employee-interest", employeeInterestRoutes);
app.use("/api/colleges", collegesRoutes);

// ---- 404 ----
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// ---- Error Handler ----
app.use(
  (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (err && err.name === "MulterError") {
      return res
        .status(400)
        .json({ success: false, message: "CV upload error: file may be too large or invalid." });
    }
    if (err && "type" in err && (err as { type?: string }).type === "entity.parse.failed") {
      return res.status(400).json({ success: false, message: "Invalid JSON body" });
    }
    if (err && "statusCode" in err && (err as { statusCode?: number }).statusCode) {
      const status = (err as { statusCode: number }).statusCode;
      if (status < 500) {
        return res.status(status).json({ success: false, message: err.message });
      }
    }
    console.error(`[server] ${req.method} ${req.path}:`, err.stack || err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
);

ensureSchema();

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);