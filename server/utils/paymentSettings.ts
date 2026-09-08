import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { paymentSettings } from "../db/schema.js";

export type PaymentMode = "demo" | "khalti" | "live";

export interface PaymentSettings {
  mode: PaymentMode;
  enabledMethods: string[];
  khaltiPublicKey: string | null;
  khaltiSecretKey: string | null;
  khaltiConfigured: boolean;
  esewaMerchantId: string | null;
  esewaSecretKey: string | null;
  esewaConfigured: boolean;
  fonepayMerchantId: string | null;
  fonepaySecretKey: string | null;
  fonepayConfigured: boolean;
}

const DEFAULT_METHODS = "Cash on Delivery,Khalti,eSewa,FonePay,Card";

export function getDefaultSettings(): PaymentSettings {
  const secret = process.env.KHALTI_SECRET_KEY || null;
  const pub = process.env.KHALTI_PUBLIC_KEY || null;
  const esewaMerchant = process.env.ESEWA_MERCHANT_ID || null;
  const esewaSecret = process.env.ESEWA_SECRET_KEY || null;
  const fonepayMerchant = process.env.FONEPAY_MERCHANT_ID || null;
  const fonepaySecret = process.env.FONEPAY_SECRET_KEY || null;
  return {
    mode: (process.env.PAYMENT_MODE as PaymentMode) || "demo",
    enabledMethods: DEFAULT_METHODS.split(","),
    khaltiPublicKey: pub,
    khaltiSecretKey: secret,
    khaltiConfigured: Boolean(secret),
    esewaMerchantId: esewaMerchant,
    esewaSecretKey: esewaSecret,
    esewaConfigured: Boolean(esewaMerchant && esewaSecret),
    fonepayMerchantId: fonepayMerchant,
    fonepaySecretKey: fonepaySecret,
    fonepayConfigured: Boolean(fonepayMerchant && fonepaySecret),
  };
}

export async function loadPaymentSettings(): Promise<PaymentSettings> {
  const fallback = getDefaultSettings();
  try {
    const rows = await db.select().from(paymentSettings).limit(1);
    if (rows.length === 0) {
      return fallback;
    }
    const row = rows[0];
    const enabledMethods = (row.enabledMethods || DEFAULT_METHODS)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const khaltiSecretKey = row.khaltiSecretKey || process.env.KHALTI_SECRET_KEY || null;
    const khaltiPublicKey = row.khaltiPublicKey || process.env.KHALTI_PUBLIC_KEY || null;
    const esewaMerchantId = row.esewaMerchantId || process.env.ESEWA_MERCHANT_ID || null;
    const esewaSecretKey = row.esewaSecretKey || process.env.ESEWA_SECRET_KEY || null;
    const fonepayMerchantId = row.fonepayMerchantId || process.env.FONEPAY_MERCHANT_ID || null;
    const fonepaySecretKey = row.fonepaySecretKey || process.env.FONEPAY_SECRET_KEY || null;

    // Migrate legacy "khalti" mode to "live"
    let mode = (row.mode as PaymentMode) || "demo";
    if (mode === "khalti") {
      mode = "live";
    }

    return {
      mode,
      enabledMethods: enabledMethods.length ? enabledMethods : DEFAULT_METHODS.split(","),
      khaltiPublicKey,
      khaltiSecretKey,
      khaltiConfigured: Boolean(khaltiSecretKey),
      esewaMerchantId,
      esewaSecretKey,
      esewaConfigured: Boolean(esewaMerchantId && esewaSecretKey),
      fonepayMerchantId,
      fonepaySecretKey,
      fonepayConfigured: Boolean(fonepayMerchantId && fonepaySecretKey),
    };
  } catch (err) {
    console.error("loadPaymentSettings failed, using defaults:", (err as Error).message);
    return fallback;
  }
}

export async function savePaymentSettings(settings: {
  mode?: string;
  enabledMethods?: string[];
  khaltiPublicKey?: string | null;
  khaltiSecretKey?: string | null;
  esewaMerchantId?: string | null;
  esewaSecretKey?: string | null;
  fonepayMerchantId?: string | null;
  fonepaySecretKey?: string | null;
}): Promise<PaymentSettings> {
  const existing = await db.select().from(paymentSettings).limit(1);
  const data = {
    mode: settings.mode || "demo",
    enabledMethods: settings.enabledMethods
      ? settings.enabledMethods.join(",")
      : DEFAULT_METHODS,
    khaltiPublicKey: settings.khaltiPublicKey ?? null,
    khaltiSecretKey: settings.khaltiSecretKey ?? null,
    esewaMerchantId: settings.esewaMerchantId ?? null,
    esewaSecretKey: settings.esewaSecretKey ?? null,
    fonepayMerchantId: settings.fonepayMerchantId ?? null,
    fonepaySecretKey: settings.fonepaySecretKey ?? null,
    updatedAt: new Date().toISOString(),
  };

  if (existing.length === 0) {
    await db.insert(paymentSettings).values(data);
  } else {
    await db
      .update(paymentSettings)
      .set(data)
      .where(eq(paymentSettings.id, existing[0].id));
  }

  return loadPaymentSettings();
}
