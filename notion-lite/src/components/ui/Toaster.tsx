"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number; // ms
};

type ToastContextValue = {
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => string;
  hide: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, duration: 2500, type: "info", ...t };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => hide(id), toast.duration);
      }
      return id;
    },
    [hide]
  );

  const value = useMemo(() => ({ toasts, show, hide }), [toasts, show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "rounded-md border bg-white p-3 shadow-md text-sm " +
              (t.type === "success"
                ? "border-green-200"
                : t.type === "error"
                ? "border-red-200"
                : "border-gray-200")
            }
          >
            {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
            {t.description && <div className="text-gray-600">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster>");
  return ctx;
}
