import "./env.js";

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
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
import { ensureSchema } from "./db/ensureSchema.js";

const PORT = parseInt(process.env.PORT || "5000", 10);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysecretkey123";
const CORS_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || CLIENT_URL)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
    const email = encodeURIComponent(authUser?.email ?? "");
    const name = encodeURIComponent(authUser?.name ?? "");
    res.redirect(`${CLIENT_URL}/call?email=${email}&name=${name}`);
  }
);

// Popup OAuth flow (used by @react-oauth/google on the client)
app.post("/auth/google/callback", handleGoogleCallback);

// ---- Route Modules ----

app.use("/", authRoutes);
app.use("/vacancies", vacanciesRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productsRoutes);
app.use("/products", productsCatalogRoutes);
app.use("/apply", applyRoutes);
app.use("/notify", notifyRoutes);
app.use("/employee-interest", employeeInterestRoutes);

// ---- Error Handler ----

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

ensureSchema();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});