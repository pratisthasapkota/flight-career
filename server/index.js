
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import pg from "pg";

import initializePassport from "./config/passport.js";


const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const SESSION_SECRET = process.env.SESSION_SECRET || "mysecretkey123";


const app = express();
app.use(express.json());


app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch(err => console.error(" Database connection error:", err));


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


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/` }),
  (req, res) => {
    const { email, name } = req.user;
    res.redirect(`${CLIENT_URL}/call?email=${email}&name=${name}`);
  }
);


app.post(
  "/sign",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const checkUser = await pool.query("SELECT * FROM login WHERE email = $1", [email]);
    if (checkUser.rows.length > 0)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyURL = `${BACKEND_URL}/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `<h2>Email Verification</h2>
             <p>Click the link below to verify your account:</p>
             <a href="${verifyURL}">${verifyURL}</a>`,
    });

    res.json({ success: true, message: "Verification email sent! Check your inbox." });
  })
);


app.get(
  "/verify/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, password } = decoded;

    const hashed = await bcrypt.hash(password, 10);
    const checkUser = await pool.query("SELECT * FROM login WHERE email = $1", [email]);

    if (checkUser.rows.length > 0) {
      return res.send("<h2>Your email is already verified!</h2>");
    }

    await pool.query(
      `INSERT INTO login (email, password, verified, verificationlink)
       VALUES ($1, $2, $3, $4)`,
      [email, hashed, true, token]
    );

    res.send(`
      <html>
        <body>
          <h2>Email verified successfully!</h2>
          <p>You can now <a href="${CLIENT_URL}/login">login</a>.</p>
        </body>
      </html>
    `);
  })
);


app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & password required" });

    const result = await pool.query("SELECT * FROM login WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ success: false, message: "Email not found" });

    const user = result.rows[0];
    if (!user.verified)
      return res.status(403).json({ success: false, message: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ success: true, token, user: { email: user.email, verified: user.verified } });
  })
);


app.post(
  "/apply",
  asyncHandler(async (req, res) => {
    const { name, email, phone, program, college, message } = req.body;
    const result = await pool.query(
      `INSERT INTO apply(name, email, phone_num, program, college, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, phone, program, college, message]
    );
    res.json({ success: true, user: result.rows[0] });
  })
);


app.post(
  "/product",
  asyncHandler(async (req, res) => {
    const { name, email, address, city, postalCode, phone, quantity, productname } = req.body;

    await pool.query(
      `INSERT INTO product(name, email, address, city, postalCode, phone, quantity, productName)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [name, email, address, city, postalCode, phone, quantity, productname]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html: `<h2>Hello ${name},</h2>
             <p>Thank you for your order.</p>
             <b>Product:</b> ${productname}<br/>
             <b>Qty:</b> ${quantity}<br/>
             <b>Address:</b> ${address}, ${city}`
    });

    res.json({ success: true, message: "Order saved & email sent!" });
  })
);


app.post(
  "/notify",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await pool.query("INSERT INTO notify (email) VALUES ($1) RETURNING *", [email]);
    res.status(201).json({ message: "Email saved", data: result.rows[0] });
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
