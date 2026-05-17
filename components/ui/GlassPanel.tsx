"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "sm" | "bordered";
  children: React.ReactNode;
  className?: string;
}

export default function GlassPanel({
  variant = "default",
  children,
  className,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      className={clsx(
        variant === "default" && "glass",
        variant === "sm" && "glass-sm",
        variant === "bordered" && "glass border-metallic",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
