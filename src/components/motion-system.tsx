"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function MotionReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduced ? 0 : 0.56, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
    >
      {children}
    </motion.section>
  );
}

export function MotionStagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.065 } } }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={revealVariants} transition={{ duration: reduced ? 0 : 0.52, ease }}>
      {children}
    </motion.div>
  );
}

export function MotionHeading({ lines, className }: { lines: ReactNode[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.h1 className={className} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.075 } } }}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-1">
          <motion.span className="block" variants={{ hidden: { opacity: 0, y: reduced ? 0 : "90%" }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduced ? 0 : 0.62, ease }}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export function AnimatedUnderline({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block h-px origin-left bg-gold", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: reduced ? 0 : 0.65, ease }}
    />
  );
}

export function MediaReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} initial={{ opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 170, damping: 24, duration: reduced ? 0 : undefined }}>
      {children}
    </motion.div>
  );
}

export function CounterReveal({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: reduced ? 0 : 0.75, ease });
    return controls.stop;
  }, [count, inView, reduced, value]);

  return <span ref={ref}><motion.span aria-hidden="true">{rounded}</motion.span><span aria-hidden="true">{suffix}</span><span className="sr-only">{value}{suffix}</span></span>;
}

export function MagneticCTA({ children, className }: { children: ReactNode; className?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.span
      className={cn("inline-flex", className)}
      animate={offset}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({ x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.12 });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  );
}

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  return (
    <motion.div key={pathname} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.34, ease }}>
      {children}
    </motion.div>
  );
}
