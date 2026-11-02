import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export type ConfirmOptions = {
  title: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export type PromptOptions = ConfirmOptions & {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  multiline?: boolean;
};

type DialogRequest =
  | { kind: "confirm"; options: ConfirmOptions; resolve: (value: boolean) => void }
  | {
      kind: "prompt";
      options: PromptOptions;
      resolve: (value: string | null) => void;
    };

type ActiveDialog = DialogRequest & { value: string };

type FeedbackContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 10000,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 460,
  background: "#fff",
  borderRadius: 14,
  padding: 24,
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.3)",
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const queueRef = useRef<DialogRequest[]>([]);
  const activeRef = useRef<ActiveDialog | null>(null);
  const toastIdRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      toastIdRef.current += 1;
      const id = toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, duration);
      timersRef.current.push(timer);
    },
    []
  );

  const success = useCallback((message: string) => toast(message, "success"), [toast]);
  const error = useCallback((message: string) => toast(message, "error", 6000), [toast]);
  const info = useCallback((message: string) => toast(message, "info"), [toast]);

  const openNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) {
      activeRef.current = null;
      setDialog(null);
      return;
    }
    const active: ActiveDialog = {
      ...next,
      value:
        next.kind === "prompt" ? next.options.defaultValue || "" : "",
    } as ActiveDialog;
    activeRef.current = active;
    setDialog(active);
  }, []);

  const enqueue = useCallback(
    (request: DialogRequest) => {
      if (activeRef.current || dialog) {
        queueRef.current.push(request);
        return;
      }
      const active: ActiveDialog = {
        ...request,
        value:
          request.kind === "prompt" ? request.options.defaultValue || "" : "",
      } as ActiveDialog;
      activeRef.current = active;
      setDialog(active);
    },
    [dialog]
  );

  const finish = useCallback(
    (value: boolean | string | null) => {
      const active = activeRef.current;
      if (!active) return;
      if (active.kind === "confirm") {
        active.resolve(Boolean(value));
      } else {
        active.resolve(typeof value === "string" ? value.trim() : null);
      }
      openNext();
    },
    [openNext]
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        enqueue({ kind: "confirm", options, resolve });
      }),
    [enqueue]
  );

  const prompt = useCallback(
    (options: PromptOptions) =>
      new Promise<string | null>((resolve) => {
        enqueue({ kind: "prompt", options, resolve });
      }),
    [enqueue]
  );

  const value = useMemo(
    () => ({ confirm, prompt, toast, success, error, info }),
    [confirm, prompt, toast, success, error, info]
  );

  const isPrompt = dialog?.kind === "prompt";
  const options = dialog?.options;
  const promptOptions = isPrompt ? (options as PromptOptions) : null;
  const confirmDisabled =
    !!promptOptions?.required && !(dialog?.value || "").trim();

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {dialog && options && (
        <div
          style={overlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) finish(false);
          }}
        >
          <div style={cardStyle}>
            <h2
              id="feedback-dialog-title"
              style={{ margin: "0 0 10px", fontSize: 19, color: "#0f172a" }}
            >
              {options.title}
            </h2>

            {options.message && (
              <div style={{ margin: "0 0 18px", color: "#475569", lineHeight: 1.5 }}>
                {options.message}
              </div>
            )}

            {promptOptions && (
              <label style={{ display: "block", marginBottom: 18 }}>
                {promptOptions.label && (
                  <span
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    {promptOptions.label}
                  </span>
                )}
                {promptOptions.multiline ? (
                  <textarea
                    autoFocus
                    value={dialog.value}
                    placeholder={promptOptions.placeholder}
                    onChange={(event) =>
                      setDialog((current) =>
                        current ? { ...current, value: event.target.value } : current
                      )
                    }
                    rows={4}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 14,
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    autoFocus
                    value={dialog.value}
                    placeholder={promptOptions.placeholder}
                    onChange={(event) =>
                      setDialog((current) =>
                        current ? { ...current, value: event.target.value } : current
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !confirmDisabled) {
                        event.preventDefault();
                        finish(dialog.value);
                      }
                    }}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 14,
                    }}
                  />
                )}
              </label>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                style={{ ...buttonStyle, background: "#e2e8f0", color: "#334155" }}
                onClick={() => finish(isPrompt ? null : false)}
              >
                {options.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                disabled={confirmDisabled}
                style={{
                  ...buttonStyle,
                  background: options.danger ? "#dc2626" : "#2563eb",
                  color: "#fff",
                  opacity: confirmDisabled ? 0.6 : 1,
                  cursor: confirmDisabled ? "not-allowed" : "pointer",
                }}
                onClick={() => finish(isPrompt ? dialog.value : true)}
              >
                {options.confirmText || (isPrompt ? "Save" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        aria-live="polite"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 10001,
          maxWidth: 380,
        }}
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            style={{
              background:
                item.type === "success"
                  ? "#166534"
                  : item.type === "error"
                  ? "#991b1b"
                  : "#1e293b",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.4,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
            }}
          >
            {item.message}
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}
