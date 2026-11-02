import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "../db/index.js";
import { paymentSessions } from "../db/schema.js";
import { sendEmail } from "../email.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loadPaymentSettings } from "../utils/paymentSettings.js";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  initiateEsewaPayment,
  verifyEsewaPayment,
  initiateFonePayPayment,
  verifyFonePayPayment,
} from "../utils/paymentGateways.js";

const router = Router();

const ONLINE_PAYMENTS = ["Khalti", "eSewa", "FonePay", "Card"];

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const WEBSITE_URL = process.env.WEBSITE_URL || process.env.CLIENT_URL || "http://localhost:3000";
const KHALTI_CALLBACK_URL = `${BACKEND_URL}/api/payment/callback/khalti`;
const ESEWA_CALLBACK_URL = `${BACKEND_URL}/api/payment/callback/esewa`;
const FONEPAY_CALLBACK_URL = `${BACKEND_URL}/api/payment/callback/fonepay`;

router.get(
  "/settings",
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await loadPaymentSettings();
    res.json({
      success: true,
      data: {
        mode: settings.mode,
        enabledMethods: settings.enabledMethods,
        khaltiPublicKey: settings.khaltiPublicKey,
        khaltiConfigured: settings.khaltiConfigured,
        esewaConfigured: settings.esewaConfigured,
        fonepayConfigured: settings.fonepayConfigured,
      },
    });
  })
);

const createSessionSchema = z.object({
  paymentMethod: z.string().min(1).max(50),
  amount: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  customerEmail: z.string().email().max(255).optional(),
  customerName: z.string().max(255).optional(),
});

const verifySchema = z.object({
  sessionId: z.string().min(1).max(100),
  paymentToken: z.string().min(6).max(50).optional(),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  walletPhone: z.string().optional(),
  pidx: z.string().optional(),
  transactionUuid: z.string().optional(),
  gatewayRef: z.string().optional(),
});

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isValidPhone = (phone?: string): boolean =>
  Boolean(phone && phone.replace(/\D/g, "").length >= 9);

router.post(
  "/create-session",
  asyncHandler(async (req: Request, res: Response) => {
    const raw = req.body as Record<string, unknown>;
    const body = {
      paymentMethod: raw.paymentMethod,
      amount: raw.amount,
      customerEmail: raw.customerEmail,
      customerName: raw.customerName,
    };

    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const { paymentMethod, amount, customerEmail, customerName } = parsed.data;

    if (!ONLINE_PAYMENTS.includes(paymentMethod)) {
      return res
        .status(400)
        .json({ success: false, message: "Cash on Delivery does not require online payment." });
    }

    const settings = await loadPaymentSettings();
    if (!settings.enabledMethods.includes(paymentMethod)) {
      return res
        .status(400)
        .json({ success: false, message: `${paymentMethod} payments are currently disabled.` });
    }

    if (settings.mode !== "demo" && paymentMethod === "Card") {
      return res.status(400).json({
        success: false,
        message: "Card payments are unavailable. Please use Khalti, eSewa, FonePay, or cash on delivery.",
      });
    }

    if (settings.mode !== "demo" && paymentMethod === "Khalti" && !settings.khaltiConfigured) {
      return res
        .status(400)
        .json({ success: false, message: "Khalti is not configured. Please set your Khalti keys in the admin panel." });
    }

    if (settings.mode !== "demo" && paymentMethod === "eSewa" && !settings.esewaConfigured) {
      return res
        .status(400)
        .json({ success: false, message: "eSewa is not configured. Please set your eSewa credentials in the admin panel." });
    }

    if (settings.mode !== "demo" && paymentMethod === "FonePay" && !settings.fonepayConfigured) {
      return res
        .status(400)
        .json({ success: false, message: "FonePay is not configured. Please set your FonePay credentials in the admin panel." });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payment amount." });
    }

    const sessionId =
      "PAY-" +
      Date.now().toString(36).toUpperCase() +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    await db.insert(paymentSessions).values({
      sessionId,
      paymentMethod,
      amount: String(amount),
      status: "pending",
      customerEmail: customerEmail || null,
      customerName: customerName || null,
      createdAt: new Date().toISOString(),
    });

    let redirectUrl: string | undefined;

    try {
      if (settings.mode === "live" || settings.mode === "khalti") {
        if (paymentMethod === "Khalti" && settings.khaltiConfigured) {
          const purchaseOrderId = sessionId;
          const result = await initiateKhaltiPayment(settings, {
            amount,
            purchaseOrderId,
            purchaseOrderName: `AeroCareers Order ${sessionId}`,
            customerEmail,
            customerName,
            returnUrl: `${KHALTI_CALLBACK_URL}?session_id=${sessionId}`,
            websiteUrl: WEBSITE_URL,
          });
          if (result.success && result.redirectUrl) {
            redirectUrl = result.redirectUrl;
            if (result.paymentReference) {
              await db
                .update(paymentSessions)
                .set({ gatewayRef: result.paymentReference })
                .where(eq(paymentSessions.sessionId, sessionId));
            }
          } else {
            return res.status(400).json({
              success: false,
              message: result.message || "Failed to initiate Khalti payment.",
            });
          }
        } else if (paymentMethod === "eSewa" && settings.esewaConfigured) {
          const transactionUuid = sessionId + "-" + crypto.randomBytes(4).toString("hex");
          const result = await initiateEsewaPayment(settings, {
            amount,
            productCode: settings.esewaMerchantId || "",
            productName: `AeroCareers Order ${sessionId}`,
            transactionUuid,
            customerEmail,
            returnUrl: `${ESEWA_CALLBACK_URL}?session_id=${sessionId}`,
          });
          if (result.success && result.redirectUrl) {
            redirectUrl = result.redirectUrl;
            await db
              .update(paymentSessions)
              .set({ gatewayRef: transactionUuid })
              .where(eq(paymentSessions.sessionId, sessionId));
          } else {
            return res.status(400).json({
              success: false,
              message: result.message || "Failed to initiate eSewa payment.",
            });
          }
        } else if (paymentMethod === "FonePay" && settings.fonepayConfigured) {
          const transactionId = sessionId;
          const result = await initiateFonePayPayment(settings, {
            amount,
            transactionId,
            customerName,
            customerEmail,
            returnUrl: `${FONEPAY_CALLBACK_URL}?session_id=${sessionId}`,
          });
          if (result.success && result.redirectUrl) {
            redirectUrl = result.redirectUrl;
            await db
              .update(paymentSessions)
              .set({ gatewayRef: transactionId })
              .where(eq(paymentSessions.sessionId, sessionId));
          } else {
            return res.status(400).json({
              success: false,
              message: result.message || "Failed to initiate FonePay payment.",
            });
          }
        }
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `Payment gateway error: ${(err as Error).message}`,
      });
    }

    res.json({
      success: true,
      sessionId,
      amount,
      paymentMethod,
      redirectUrl,
    });
  })
);

router.post(
  "/verify",
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const {
      sessionId,
      paymentToken,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvv,
      walletPhone,
      pidx,
      transactionUuid,
      gatewayRef,
    } = parsed.data;

    const sessions = await db
      .select()
      .from(paymentSessions)
      .where(eq(paymentSessions.sessionId, sessionId));

    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Payment session not found. Please try again." });
    }

    const session = sessions[0];

    if (session.status === "completed") {
      return res.status(400).json({ success: false, message: "This payment has already been completed." });
    }

    if (session.status === "failed") {
      return res.status(400).json({ success: false, message: "This payment attempt has expired. Please restart checkout." });
    }

    const method = session.paymentMethod;

    const settings = await loadPaymentSettings();
    if (!settings.enabledMethods.includes(method)) {
      return res
        .status(400)
        .json({ success: false, message: `${method} payments are currently disabled.` });
    }

    const currentTime = Date.now();
    const createdAt = new Date(session.createdAt).getTime();
    if (currentTime - createdAt > 10 * 60 * 1000) {
      await db
        .update(paymentSessions)
        .set({ status: "failed" })
        .where(eq(paymentSessions.sessionId, sessionId));
      return res.status(400).json({ success: false, message: "Payment session has expired. Please restart checkout." });
    }

    let gatewayTxnId: string | undefined;

    const storedRef = session.gatewayRef || "";

    try {
      if (settings.mode === "demo") {
        if (method === "Card") {
          if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            return res.status(400).json({ success: false, message: "Please fill in all card details." });
          }

          const digits = cardNumber.replace(/\D/g, "");
          if (digits.length < 13 || digits.length > 19) {
            return res.status(400).json({ success: false, message: "Invalid card number." });
          }

          const cvvDigits = cardCvv.replace(/\D/g, "");
          if (cvvDigits.length < 3 || cvvDigits.length > 4) {
            return res.status(400).json({ success: false, message: "Invalid CVV." });
          }

          const expiryMatch = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim());
          if (!expiryMatch) {
            return res.status(400).json({ success: false, message: "Invalid expiry date. Use MM/YY." });
          }

          if (!paymentToken || !/^\d{6}$/.test(paymentToken)) {
            return res.status(400).json({ success: false, message: "OTP must be a 6-digit code." });
          }

          gatewayTxnId = "CARD-" + crypto.randomBytes(6).toString("hex").toUpperCase();
        } else {
          if (!isValidPhone(walletPhone)) {
            return res.status(400).json({ success: false, message: "Please enter a valid wallet phone number." });
          }
          if (!paymentToken || !/^\d{6}$/.test(paymentToken)) {
            return res.status(400).json({ success: false, message: "OTP must be a 6-digit code." });
          }
          gatewayTxnId = "TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
        }
      } else if (method === "Card") {
        return res.status(400).json({
          success: false,
          message: "Card payments are unavailable. Please use Khalti, eSewa, FonePay, or cash on delivery.",
        });
      } else if (method === "Khalti") {
        if (!storedRef) {
          return res.status(400).json({ success: false, message: "Khalti payment reference is missing." });
        }
        const result = await verifyKhaltiPayment(settings, storedRef);
        if (!result.success) {
          return res.status(400).json({ success: false, message: result.message });
        }
        if (result.reference && result.reference !== storedRef) {
          return res.status(400).json({ success: false, message: "Khalti payment reference mismatch." });
        }
        if (
          result.amount !== undefined &&
          result.amount !== Math.round(Number(session.amount) * 100)
        ) {
          return res.status(400).json({ success: false, message: "Khalti payment amount mismatch." });
        }
        gatewayTxnId = result.gatewayTxnId;
      } else if (method === "eSewa") {
        if (!storedRef) {
          return res.status(400).json({ success: false, message: "eSewa payment reference is missing." });
        }
        const result = await verifyEsewaPayment(settings, storedRef, Number(session.amount));
        if (!result.success) {
          return res.status(400).json({ success: false, message: result.message });
        }
        if (
          result.amount !== undefined &&
          Math.abs(result.amount - Number(session.amount)) > 0.01
        ) {
          return res.status(400).json({ success: false, message: "eSewa payment amount mismatch." });
        }
        gatewayTxnId = result.gatewayTxnId || gatewayRef;
      } else if (method === "FonePay") {
        const reference = storedRef || sessionId;
        if (!reference) {
          return res.status(400).json({ success: false, message: "FonePay payment reference is missing." });
        }
        const result = await verifyFonePayPayment(settings, reference, Number(session.amount));
        if (!result.success) {
          return res.status(400).json({ success: false, message: result.message });
        }
        gatewayTxnId = result.gatewayTxnId || reference;
      } else {
        return res.status(400).json({ success: false, message: `Unsupported payment method: ${method}` });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `Payment verification error: ${(err as Error).message}`,
      });
    }

    const txnId =
      "TXN-" +
      Date.now().toString(36).toUpperCase() +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    const completed = await db
      .update(paymentSessions)
      .set({
        status: "completed",
        completedAt: new Date().toISOString(),
        gatewayTxnId: gatewayTxnId || null,
      })
      .where(
        and(
          eq(paymentSessions.sessionId, sessionId),
          eq(paymentSessions.status, "pending")
        )
      )
      .returning({ id: paymentSessions.id });

    if (completed.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This payment has already been processed.",
      });
    }

    if (session.customerEmail) {
      await sendEmail(req, {
        from: process.env.EMAIL_USER,
        to: session.customerEmail,
        subject: `Payment Confirmation ${txnId}`,
        html: `<h2>Payment Successful</h2>
               <p>Dear ${escapeHtml(session.customerName || "Customer")},</p>
               <p>Your payment has been processed successfully.</p>
               <p><b>Transaction ID:</b> ${escapeHtml(txnId)}<br/>
               <b>Gateway Reference:</b> ${escapeHtml(gatewayTxnId || txnId)}<br/>
               <b>Amount:</b> $${Number(session.amount).toFixed(2)}<br/>
               <b>Method:</b> ${escapeHtml(method)}</p>
               <p>Your order will be confirmed with a separate email shortly.</p>`,
      });
    }

    res.json({
      success: true,
      message: "Payment successful",
      data: {
        txnId,
        gatewayRef: gatewayTxnId,
        amount: Number(session.amount),
        paymentMethod: method,
      },
    });
  })
);

router.get(
  "/session/:sessionId",
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.params.sessionId || "");
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Missing session id" });
    }

    const sessions = await db
      .select()
      .from(paymentSessions)
      .where(eq(paymentSessions.sessionId, sessionId));

    if (sessions.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const s = sessions[0];
    res.json({
      success: true,
      data: {
        sessionId: s.sessionId,
        paymentMethod: s.paymentMethod,
        amount: Number(s.amount),
        status: s.status,
        createdAt: s.createdAt,
        completedAt: s.completedAt,
      },
    });
  })
);

router.get(
  "/callback/khalti",
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.query.session_id || req.query.purchase_order_id || "");
    const pidx = String(req.query.pidx || req.query.token || "");
    if (!sessionId) {
      return res.redirect(`${CLIENT_URL}/payment?error=invalid_session`);
    }
    res.redirect(`${CLIENT_URL}/payment?session_id=${sessionId}&gateway=khalti&pidx=${encodeURIComponent(pidx)}&verified=true`);
  })
);

router.get(
  "/callback/esewa",
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.query.session_id || req.query.oid || "");
    const transactionUuid = String(req.query.transaction_uuid || req.query.refId || "");
    const responseCode = String(req.query.status || req.query.response || "");
    if (!sessionId) {
      return res.redirect(`${CLIENT_URL}/payment?error=invalid_session`);
    }
    if (responseCode === "Success" || responseCode === "COMPLETE" || responseCode === "1") {
      res.redirect(`${CLIENT_URL}/payment?session_id=${sessionId}&gateway=esewa&txn_uuid=${encodeURIComponent(transactionUuid)}&verified=true`);
    } else {
      res.redirect(`${CLIENT_URL}/payment?session_id=${sessionId}&gateway=esewa&error=payment_failed`);
    }
  })
);

router.get(
  "/callback/fonepay",
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.query.session_id || req.query.D || req.query.UUID || "");
    const gatewayRef = String(req.query.RID || req.query.UUID || req.query.D || "");
    const status = String(req.query.ST || req.query.status || "");
    if (!sessionId) {
      return res.redirect(`${CLIENT_URL}/payment?error=invalid_session`);
    }
    if (status === "1" || status === "success" || status === "SUCCESS") {
      res.redirect(`${CLIENT_URL}/payment?session_id=${sessionId}&gateway=fonepay&ref=${encodeURIComponent(gatewayRef)}&verified=true`);
    } else {
      res.redirect(`${CLIENT_URL}/payment?session_id=${sessionId}&gateway=fonepay&error=payment_failed`);
    }
  })
);

export default router;
