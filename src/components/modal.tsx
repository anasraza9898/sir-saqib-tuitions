"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onClose, labelledBy, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const panel = panelRef.current;
    const focusable = panel ? Array.from(panel.querySelectorAll<HTMLElement>(selector)) : [];
    (focusable[0] ?? panel)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(selector));
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5">
          <motion.button
            className="absolute inset-0 cursor-default bg-ink/72"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.99 }}
            transition={{ duration: reduced ? 0 : 0.24 }}
            className={cn(
              "relative z-10 max-h-[92dvh] w-full overflow-y-auto bg-paper shadow-2xl outline-none sm:max-w-xl sm:rounded-sm",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
