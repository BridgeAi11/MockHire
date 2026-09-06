import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatScore(score: number | undefined): string {
  if (score === undefined || isNaN(score)) return "N/A";
  return `${Math.round(score)}%`;
}

export function getIntegrityBadge(score: number = 100): {
  label: string;
  variant: "success" | "warning" | "danger";
  description: string;
} {
  if (score >= 90) {
    return {
      label: "Normal",
      variant: "success",
      description: "Consistent browser activity observed.",
    };
  }
  if (score >= 70) {
    return {
      label: "Review Recommended",
      variant: "warning",
      description: "Minor window blurs or clipboard events recorded.",
    };
  }
  return {
    label: "High-Risk Signals",
    variant: "danger",
    description: "Multiple tab switches or rapid response anomalies detected.",
  };
}

export function getReadinessTier(score: number): {
  label: string;
  color: string;
  badgeClass: string;
} {
  if (score >= 80) {
    return {
      label: "Assessment Ready",
      color: "text-emerald-600",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (score >= 60) {
    return {
      label: "Needs Targeted Practice",
      color: "text-blue-600",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  return {
    label: "Foundational Revision",
    color: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  };
}
