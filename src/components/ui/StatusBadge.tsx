import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "neutral",
  className,
}) => {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === "success" && "bg-emerald-500",
          variant === "warning" && "bg-amber-500",
          variant === "danger" && "bg-rose-500",
          variant === "info" && "bg-blue-500",
          variant === "neutral" && "bg-slate-400"
        )}
      />
      {status}
    </span>
  );
};
