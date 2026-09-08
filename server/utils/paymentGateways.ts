import crypto from "crypto";
import type { PaymentSettings } from "./paymentSettings.js";

export interface GatewayInitiateResult {
  success: boolean;
  redirectUrl?: string;
  paymentReference?: string;
  token?: string;
  message?: string;
}

export interface GatewayVerifyResult {
  success: boolean;
  status?: string;
  message?: string;
  gatewayTxnId?: string;
}

const KHALTI_INITIATE_URL = "https://khalti.com/api/v2/payment/initiate/";
const KHALTI_VERIFY_URL = "https://khalti.com/api/v2/payment/verify/";
const ESEWA_PAYMENT_URL = "https://epay.esewa.com.np/api/epay/v2/forms";
const ESEWA_VERIFY_URL = "https://esewa.com.np/api/epay/v2/transaction/status/";
const FONEPAY_INITIATE_URL = "https://fonepay.com/merchantRequest/merchantRequest.ashx";
const FONEPAY_VERIFY_URL = "https://fonepay.com/merchantRequest/verifyRequest.ashx";

function khaltiHeaders(secretKey: string): Record<string, string> {
  return {
    Authorization: `Key ${secretKey}`,
    "Content-Type": "application/json",
  };
}

export async function initiateKhaltiPayment(
  settings: PaymentSettings,
  details: {
    amount: number;
    purchaseOrderId: string;
    purchaseOrderName: string;
    customerEmail?: string;
    customerName?: string;
    returnUrl: string;
    websiteUrl: string;
  }
): Promise<GatewayInitiateResult> {
  if (!settings.khaltiSecretKey) {
    return { success: false, message: "Khalti secret key is not configured" };
  }

  const body = {
    return_url: details.returnUrl,
    website_url: details.websiteUrl,
    amount: Math.round(details.amount * 100),
    purchase_order_id: details.purchaseOrderId,
    purchase_order_name: details.purchaseOrderName,
    customer_info: {
      name: details.customerName || "",
      email: details.customerEmail || "",
    },
  };

  const resp = await fetch(KHALTI_INITIATE_URL, {
    method: "POST",
    headers: khaltiHeaders(settings.khaltiSecretKey),
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => "");
    return { success: false, message: `Khalti initiation failed (${resp.status}): ${err}` };
  }

  const data = (await resp.json()) as {
    payment_url?: string;
    pidx?: string;
    expires_at?: string;
  };

  if (!data.pidx || !data.payment_url) {
    return { success: false, message: "Khalti did not return a payment URL" };
  }

  return {
    success: true,
    redirectUrl: data.payment_url,
    paymentReference: data.pidx,
  };
}

export async function verifyKhaltiPayment(
  settings: PaymentSettings,
  pidx: string
): Promise<GatewayVerifyResult> {
  if (!settings.khaltiSecretKey) {
    return { success: false, message: "Khalti secret key is not configured" };
  }

  const resp = await fetch(KHALTI_VERIFY_URL, {
    method: "POST",
    headers: khaltiHeaders(settings.khaltiSecretKey),
    body: JSON.stringify({ pidx }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => "");
    return { success: false, message: `Khalti verification failed (${resp.status}): ${err}` };
  }

  const data = (await resp.json()) as {
    pidx?: string;
    status?: string;
    total_amount?: number;
    transaction_id?: string;
  };

  if (data.status !== "Completed") {
    return { success: false, message: `Khalti payment not completed (status: ${data.status})` };
  }

  return {
    success: true,
    status: data.status,
    gatewayTxnId: data.transaction_id,
  };
}

export async function initiateEsewaPayment(
  settings: PaymentSettings,
  details: {
    amount: number;
    productCode: string;
    productName: string;
    transactionUuid: string;
    customerEmail?: string;
    returnUrl: string;
  }
): Promise<GatewayInitiateResult> {
  if (!settings.esewaMerchantId || !settings.esewaSecretKey) {
    return { success: false, message: "eSewa credentials are not configured" };
  }

  const merchantCode = settings.esewaMerchantId;
  const amount = details.amount.toFixed(2);
  const tax = "0.00";
  const serviceCharge = "0.00";
  const deliveryCharge = "0.00";
  const total = details.amount.toFixed(2);
  const signedString = `total_amount=${total},transaction_uuid=${details.transactionUuid},product_code=${merchantCode}`;
  const signature = crypto
    .createHmac("sha256", settings.esewaSecretKey)
    .update(signedString)
    .digest("base64");

  const formData = new URLSearchParams({
    amount,
    tax_amount: tax,
    total_amount: total,
    transaction_uuid: details.transactionUuid,
    product_code: merchantCode,
    product_service_charge: serviceCharge,
    product_delivery_charge: deliveryCharge,
    success_url: details.returnUrl.replace("KHALTI_CALLBACK", "ESEWA_CALLBACK"),
    failure_url: details.returnUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  });

  return {
    success: true,
    redirectUrl: `${ESEWA_PAYMENT_URL}?${formData.toString()}`,
    paymentReference: details.transactionUuid,
  };
}

export async function verifyEsewaPayment(
  settings: PaymentSettings,
  transactionUuid: string,
  totalAmount: number
): Promise<GatewayVerifyResult> {
  if (!settings.esewaMerchantId || !settings.esewaSecretKey) {
    return { success: false, message: "eSewa credentials are not configured" };
  }

  const params = new URLSearchParams({
    product_code: settings.esewaMerchantId,
    total_amount: totalAmount.toFixed(2),
    transaction_uuid: transactionUuid,
  });

  const resp = await fetch(`${ESEWA_VERIFY_URL}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => "");
    return { success: false, message: `eSewa verification failed (${resp.status}): ${err}` };
  }

  const data = (await resp.json()) as {
    status?: string;
    ref_id?: string;
    transaction_id?: string;
  };

  if (data.status !== "COMPLETE") {
    return { success: false, message: `eSewa payment not completed (status: ${data.status})` };
  }

  return {
    success: true,
    status: data.status,
    gatewayTxnId: data.transaction_id,
  };
}

export async function initiateFonePayPayment(
  settings: PaymentSettings,
  details: {
    amount: number;
    transactionId: string;
    customerName?: string;
    customerEmail?: string;
    returnUrl: string;
  }
): Promise<GatewayInitiateResult> {
  if (!settings.fonepayMerchantId || !settings.fonepaySecretKey) {
    return { success: false, message: "FonePay credentials are not configured" };
  }

  const merchantCode = settings.fonepayMerchantId;
  const amount = details.amount.toFixed(2);
  const signature = crypto
    .createHmac("sha256", settings.fonepaySecretKey)
    .update(details.transactionId)
    .update(amount)
    .update(merchantCode)
    .digest("base64");

  const formData = new URLSearchParams({
    M: merchantCode,
    R: details.returnUrl,
    D: details.transactionId,
    U: davidAmount(details.amount),
    A: amount,
    UUID: details.transactionId,
    O: details.returnUrl,
    Signature: signature,
    C: "NPR",
  });

  const redirectUrl = `${FONEPAY_INITIATE_URL}?${formData.toString()}`;

  return {
    success: true,
    redirectUrl,
    paymentReference: details.transactionId,
  };
}

function davidAmount(amount: number): string {
  return amount.toFixed(2);
}

export async function verifyFonePayPayment(
  settings: PaymentSettings,
  transactionId: string,
  amount: number
): Promise<GatewayVerifyResult> {
  if (!settings.fonepayMerchantId || !settings.fonepaySecretKey) {
    return { success: false, message: "FonePay credentials are not configured" };
  }

  const signature = crypto
    .createHmac("sha256", settings.fonepaySecretKey)
    .update(transactionId)
    .update(amount.toFixed(2))
    .update(settings.fonepayMerchantId)
    .digest("base64");

  const params = new URLSearchParams({
    M: settings.fonepayMerchantId,
    D: transactionId,
    A: amount.toFixed(2),
    Signature: signature,
    UUID: transactionId,
  });

  const resp = await fetch(`${FONEPAY_VERIFY_URL}?${params.toString()}`, {
    method: "GET",
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => "");
    return { success: false, message: `FonePay verification failed (${resp.status}): ${err}` };
  }

  const text = await resp.text();
  try {
    const data = JSON.parse(text) as {
      status?: string;
      transaction_id?: string;
      message?: string;
    };
    if (data.status?.toUpperCase() !== "OK" && data.message !== "Verification successful") {
      return { success: false, message: `FonePay payment not completed: ${data.message || data.status}` };
    }
    return { success: true, status: "COMPLETE", gatewayTxnId: data.transaction_id };
  } catch {
    if (text.trim().toUpperCase().includes("OK")) {
      return { success: true, status: "COMPLETE", gatewayTxnId: transactionId };
    }
    return { success: false, message: `FonePay verification failed: ${text}` };
  }
}
