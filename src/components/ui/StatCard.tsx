import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = "text-blue-600 bg-blue-50",
  className,
}) => {
  return (
    <div className={cn("saas-card p-5 transition-all duration-200", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className={cn("p-2 rounded-lg", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
