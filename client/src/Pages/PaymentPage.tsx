import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

interface PaymentState {
  sessionId: string;
  paymentMethod: string;
  amount: number;
  customerEmail: string;
  customerName: string;
}

interface OrderPayload {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  paymentMethod: string;
  paymentSessionId: string;
  paymentTxnId: string;
  sessionId?: string;
  amount?: number;
  items: {
    productId: string | null;
    productname: string;
    quantity: number;
    price: number;
    size: string;
  }[];
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = location.state as
    | (PaymentState & { orderPayload?: OrderPayload })
    | undefined;

  const [walletPhone, setWalletPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"details" | "otp" | "processing" | "success">("details");
  const [error, setError] = useState("");
  const [txnId, setTxnId] = useState("");
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verifiedRef = useRef(false);

  const querySessionId = searchParams.get("session_id") || "";
  const gateway = searchParams.get("gateway") || "";
  const verified = searchParams.get("verified") === "true";
  const pidx = searchParams.get("pidx") || "";
  const txnUuid = searchParams.get("txn_uuid") || "";
  const gatewayRef = searchParams.get("ref") || "";
  const queryError = searchParams.get("error") || "";

  const pay = state;
  const isCard = pay?.paymentMethod === "Card";

  const [pendingOrder, setPendingOrder] = useState<OrderPayload | null>(null);

  useEffect(() => {
    if (querySessionId && verified && !pay?.orderPayload) {
      try {
        const raw = sessionStorage.getItem("pendingOrderPayload");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.sessionId === querySessionId) {
            setPendingOrder(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line
  }, []);

  const effectiveSessionId = pay?.sessionId || querySessionId;
  const effectiveOrder = pay?.orderPayload || pendingOrder;
  const effectiveMethod = pay?.paymentMethod || (gateway === "khalti" ? "Khalti" : gateway === "esewa" ? "eSewa" : gateway === "fonepay" ? "FonePay" : "");
  const effectiveAmount = pay?.amount ?? pendingOrder?.amount ?? (effectiveOrder ? (effectiveOrder as any).items?.reduce((s: number, it: any) => s + (Number(it?.price) || 0) * (Number(it?.quantity) || 1), 0) : null);
  const effectiveMethodName = pay?.paymentMethod || effectiveMethod;

  useEffect(() => {
    if (queryError) {
      setError("Payment was not completed. Please try again.");
    }

    if (verified && querySessionId) {
      if (verifiedRef.current) return;
      verifiedRef.current = true;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
      setStage("processing");

      axios
        .post(`${backendUrl}/api/payment/verify`, {
          sessionId: querySessionId,
          paymentToken: "000000",
          pidx,
          transactionUuid: txnUuid,
          gatewayRef,
        })
        .then((res) => {
          if (res.data?.success) {
            const newTxnId = res.data?.data?.txnId || "";
            setTxnId(newTxnId);
            setStage("success");
          } else {
            setError(res.data?.message || "Payment verification failed.");
            setStage("details");
          }
        })
        .catch((err: any) => {
          setError(err.response?.data?.message || "Payment verification failed. Please try again.");
          setStage("details");
        });
      return;
    }

    if (!pay?.sessionId && !querySessionId) {
      navigate("/store");
      return;
    }

    const sessionIdToCheck = pay?.sessionId || querySessionId;

    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    axios
      .get(`${backendUrl}/api/payment/session/${sessionIdToCheck}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          if (res.data.data.status === "completed") {
            setStage("success");
          }
        }
      })
      .catch(() => {});

    setExpirySeconds(300);
    timerRef.current = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          navigate("/store");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resendRef.current) clearInterval(resendRef.current);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (otpResendCooldown <= 0) {
      if (resendRef.current) clearInterval(resendRef.current);
      return;
    }
    resendRef.current = setInterval(() => {
      setOtpResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendRef.current) clearInterval(resendRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (resendRef.current) clearInterval(resendRef.current);
    };
  }, [otpResendCooldown]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendOtp = () => {
    setError("");
    if (isCard) {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 13) {
        setError("Please enter a valid card number.");
        return;
      }
      if (!cardName.trim()) {
        setError("Please enter the name on the card.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv.trim())) {
        setError("Please enter a valid CVV.");
        return;
      }
    } else {
      const digits = walletPhone.replace(/\D/g, "");
      if (digits.length < 9) {
        setError("Please enter a valid wallet phone number (e.g. 97XXXXXXXX).");
        return;
      }
    }
    setStage("processing");
    setTimeout(() => {
      setStage("otp");
    }, 1200);
  };

  const handlePay = () => {
    setError("");
    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setStage("processing");
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    axios
      .post(`${backendUrl}/api/payment/verify`, {
        sessionId: pay?.sessionId,
        paymentToken: otp,
        walletPhone: !isCard ? walletPhone : undefined,
        cardNumber: isCard ? cardNumber : undefined,
        cardName: isCard ? cardName : undefined,
        cardExpiry: isCard ? cardExpiry : undefined,
        cardCvv: isCard ? cardCvv : undefined,
      })
      .then((res) => {
        if (res.data?.success) {
          const newTxnId = res.data?.data?.txnId || "";
          setTxnId(newTxnId);
          setStage("success");
        } else {
          setError(res.data?.message || "Payment failed. Please try again.");
          setStage(isCard ? "details" : "otp");
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.message || "Payment failed. Please try again.");
        setStage(isCard ? "details" : "otp");
      });
  };

  const handleConfirmOrder = () => {
    if (!effectiveOrder) {
      sessionStorage.removeItem("pendingOrderPayload");
      navigate("/store");
      return;
    }
    const orderPayload = (pay?.orderPayload || { ...effectiveOrder, name: (effectiveOrder as any).name, email: (effectiveOrder as any).email, address: (effectiveOrder as any).address, city: (effectiveOrder as any).city, postalCode: (effectiveOrder as any).postalCode, phone: (effectiveOrder as any).phone, paymentMethod: (effectiveOrder as any).paymentMethod, items: (effectiveOrder as any).items });
    setError("");
    setStage("processing");
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const payload = {
      ...orderPayload,
      paymentSessionId: effectiveSessionId,
      paymentTxnId: txnId,
    };

    axios
      .post(`${backendUrl}/api/product`, payload)
      .then((res) => {
        if (res.data?.success) {
          localStorage.removeItem("aeroCart");
          sessionStorage.removeItem("pendingOrderPayload");
          navigate("/price", {
            state: {
              paymentSuccess: true,
              paymentMethod: effectiveMethodName,
              txnId,
              orderId: res.data?.data?.orderId,
              name: (effectiveOrder as any)?.name || pay?.customerName,
              email: (effectiveOrder as any)?.email || pay?.customerEmail,
              amount: effectiveAmount || pay?.amount,
            },
          });
        } else {
          setError(res.data?.message || "Failed to place order.");
          setStage("success");
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.message || "Failed to place order. Please try again.");
        setStage("success");
      });
  };

  if (!pay?.sessionId && !querySessionId) {
    return (
      <>
        <Navbar />
        <div style={styles.centerBox}>
          <p>Invalid payment session. Redirecting...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (stage === "success") {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.title}>Payment Successful</h2>
            <p style={styles.text}>
              You have been charged <strong>${(effectiveAmount || pay?.amount || 0).toFixed(2)}</strong> via{" "}
              <strong>{effectiveMethodName}</strong>.
            </p>
            {txnId && (
              <div style={styles.txnBox}>
                <div style={styles.txnLabel}>Transaction ID</div>
                <div style={styles.txnValue}>{txnId}</div>
              </div>
            )}
            {effectiveOrder ? (
              <div style={styles.shippingNote}>
                Your order is being prepared. A confirmation email will be sent to{" "}
                <strong>{(effectiveOrder as any)?.email || pay?.customerEmail}</strong>.
              </div>
            ) : (
              <div style={styles.shippingNote}>
                Your payment was successful. Please contact customer support if you need assistance.
              </div>
            )}
            {error && <div style={styles.error}>{error}</div>}
            {effectiveOrder ? (
              <button style={styles.primaryBtn} onClick={handleConfirmOrder}>
                Confirm My Order
              </button>
            ) : (
              <button style={styles.primaryBtn} onClick={() => navigate("/store")}>
                Continue Shopping
              </button>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (stage === "processing") {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.loadingSpinner} />
            <h2 style={styles.title}>Processing Payment...</h2>
            <p style={styles.text}>Please do not close this window.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.split}>
          <div style={styles.card}>
            <div style={styles.payHeader}>
              <div style={styles.payIcon}>
                {pay.paymentMethod === "Cash on Delivery" ? "💵" : pay.paymentMethod === "Khalti" ? "📱" : pay.paymentMethod === "eSewa" ? "💳" : pay.paymentMethod === "FonePay" ? "🏦" : "💳"}
              </div>
              <div>
                <div style={styles.payTitle}>Pay with {pay.paymentMethod}</div>
                <div style={styles.paySub}>Secured by SSL encryption</div>
              </div>
            </div>

            <div style={styles.amountRow}>
              <span>Amount Due</span>
              <span style={styles.amount}>${(pay.amount || 0).toFixed(2)}</span>
            </div>

            {stage === "otp" ? (
              <div style={styles.otpBox}>
                <div style={styles.otpTitle}>
                  Enter the 6-digit OTP sent to{" "}
                  {isCard
                    ? "your registered phone"
                    : `${walletPhone.slice(0, 3)}******${walletPhone.slice(-2)}`}
                </div>
                <input
                  style={styles.otpInput}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                />
                <div style={styles.otpActions}>
                  <span style={styles.resendText}>
                    {otpResendCooldown > 0
                      ? `Resend OTP in ${otpResendCooldown}s`
                      : "Didn't receive it?"}
                  </span>
                  <button
                    style={styles.resendBtn}
                    disabled={otpResendCooldown > 0}
                    onClick={() => {
                      setOtp("");
                      setOtpResendCooldown(30);
                    }}
                  >
                    Resend
                  </button>
                </div>
                {error && <div style={styles.error}>{error}</div>}
                <button style={styles.primaryBtn} onClick={handlePay}>
                  Verify & Pay ${(pay.amount || 0).toFixed(2)}
                </button>
              </div>
            ) : (
              <>
                {isCard ? (
                  <>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Card Number</label>
                      <input
                        style={styles.input}
                        placeholder="4111 1111 1111 1111"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(
                            e.target.value
                              .replace(/[^\d ]/g, "")
                              .replace(/(\d{4})(?=\d)/g, "$1 ")
                              .slice(0, 23)
                          )
                        }
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Name on Card</label>
                      <input
                        style={styles.input}
                        placeholder="JOHN DOE"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div style={styles.fieldRow}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Expiry (MM/YY)</label>
                        <input
                          style={styles.input}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardExpiry(v);
                          }}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>CVV</label>
                        <input
                          style={styles.input}
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                        />
                      </div>
                    </div>
                    <button style={styles.primaryBtn} onClick={handleSendOtp}>
                      Continue & Pay
                    </button>
                  </>
                ) : (
                  <>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>{pay.paymentMethod} Wallet Number</label>
                      <input
                        style={styles.input}
                        placeholder="97XXXXXXXX"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                      />
                    </div>
                    <button style={styles.primaryBtn} onClick={handleSendOtp}>
                      Send OTP <span style={styles.resendHint}>&rarr;</span>
                    </button>
                  </>
                )}

                {error && <div style={styles.error}>{error}</div>}
              </>
            )}

            <div style={styles.footer}>
              <span style={styles.timer}>⏱ {formatTime(expirySeconds)}</span>
              <button style={styles.cancelBtn} onClick={() => navigate("/store")}>
                Cancel
              </button>
            </div>
          </div>

          <div style={styles.sideCard}>
            <div style={styles.sideTitle}>Payment Summary</div>
            <div style={styles.sideRow}>
              <span>Method</span>
              <span style={styles.sideValue}>{pay.paymentMethod}</span>
            </div>
            <div style={styles.sideRow}>
              <span>Amount</span>
              <span style={styles.sideValue}>${(pay.amount || 0).toFixed(2)}</span>
            </div>
            <div style={styles.sideDivider} />
            <div style={styles.secureBadge}>
              🔒 <span>Your payment details are encrypted and never stored.</span>
            </div>
            <div style={styles.helpBox}>
              <div>Need help?</div>
              <div style={styles.helpSub}>Contact support at support@example.com</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f5f7fb",
    fontFamily: "'Poppins', sans-serif",
  },
  split: {
    display: "flex",
    gap: "24px",
    maxWidth: "900px",
    width: "100%",
    flexWrap: "wrap",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    flex: 1,
    minWidth: "300px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  sideCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    width: "280px",
    height: "fit-content",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  centerBox: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    color: "#666",
  },
  payHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "2px solid #f0f0f0",
  },
  payIcon: {
    fontSize: "2rem",
  },
  payTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#001a3d",
  },
  paySub: {
    fontSize: "0.8rem",
    color: "#888",
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f0f7ff",
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "22px",
  },
  amount: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#00509e",
  },
  fieldGroup: {
    marginBottom: "16px",
    flex: 1,
  },
  fieldRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#444",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "2px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    background: "#fafafa",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #00509e, #003f7f)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  resendHint: {
    marginLeft: "4px",
  },
  otpBox: {
    marginTop: "20px",
    padding: "18px",
    background: "#f9fbff",
    borderRadius: "12px",
    border: "2px solid #e3ecf7",
    animation: "fadeInUp 0.4s ease",
  },
  otpTitle: {
    fontSize: "0.85rem",
    color: "#555",
    marginBottom: "12px",
  },
  otpInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "2px solid #00509e",
    borderRadius: "8px",
    fontSize: "1.4rem",
    textAlign: "center",
    letterSpacing: "8px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    background: "white",
  },
  otpActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0 12px",
  },
  resendText: {
    fontSize: "0.8rem",
    color: "#888",
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#00509e",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.85rem",
    fontFamily: "'Poppins', sans-serif",
  },
  error: {
    background: "#fff0f0",
    border: "1px solid #f5c6c6",
    color: "#c62828",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    margin: "12px 0",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "2px solid #f0f0f0",
  },
  timer: {
    fontSize: "0.85rem",
    color: "#e53935",
    fontWeight: 600,
  },
  cancelBtn: {
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "'Poppins', sans-serif",
  },
  sideTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#001a3d",
    marginBottom: "14px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
  },
  sideRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "0.9rem",
    color: "#666",
  },
  sideValue: {
    fontWeight: 600,
    color: "#001a3d",
  },
  sideDivider: {
    borderTop: "1px solid #eee",
    margin: "14px 0",
  },
  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.78rem",
    color: "#00509e",
    background: "#f0f9ff",
    padding: "10px",
    borderRadius: "8px",
  },
  helpBox: {
    marginTop: "16px",
    fontSize: "0.8rem",
    color: "#888",
    background: "#fafafa",
    padding: "12px",
    borderRadius: "8px",
  },
  helpSub: {
    fontSize: "0.75rem",
    marginTop: "4px",
    color: "#aaa",
  },
  successIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00c853, #009624)",
    color: "white",
    fontSize: "2.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    animation: "scaleIn 0.5s ease",
  },
  title: {
    textAlign: "center",
    color: "#001a3d",
    marginBottom: "10px",
  },
  text: {
    textAlign: "center",
    color: "#666",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    marginBottom: "16px",
  },
  txnBox: {
    background: "#f0f7ff",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "16px",
    textAlign: "center",
  },
  txnLabel: {
    fontSize: "0.75rem",
    color: "#888",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  txnValue: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#00509e",
    fontFamily: "monospace",
  },
  shippingNote: {
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "20px",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "4px solid #e3ecf7",
    borderTopColor: "#00509e",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
};

export default PaymentPage;
