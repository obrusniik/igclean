"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface MetallicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function MetallicButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: MetallicButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      whileHover={{ scale: isDisabled ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      className={clsx(
        "relative inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-opacity select-none overflow-hidden",
        size === "sm" && "text-xs px-4 py-2 rounded-xl",
        size === "md" && "text-sm px-6 py-3 rounded-2xl",
        size === "lg" && "text-base px-8 py-4 rounded-2xl",
        variant === "primary" && "text-zinc-950 bg-metallic",
        variant === "ghost" &&
          "text-white/80 hover:text-white border border-white/10 hover:border-white/20 bg-transparent",
        isDisabled && "opacity-40 cursor-not-allowed",
        className
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-zinc-900/40 border-t-zinc-900 animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
