"use client";

import React from "react";
import {
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";

export default function StudentProgressPage() {
  return (
    <AppShell role="STUDENT" title="Progress & Analytics">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Performance Progression & Mastery Trends
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track historical mock assessment accuracy, current streak, and topic-level mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Active Daily Streak"
            value="5 Days"
            icon={Zap}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Personal record: 12 days"
          />
          <StatCard
            title="Average Assessment Score"
            value="75.2%"
            trend={{ value: "3.8%", isPositive: true }}
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Past 10 mock sessions"
          />
          <StatCard
            title="Total Questions Solved"
            value="348"
            icon={CheckCircle2}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="82% accuracy rate"
          />
        </div>

        {/* Topic Mastery Grid */}
        <div className="saas-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Topic-Level Mastery Index</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { topic: "Pipes & Cisterns", domain: "Numerical", mastery: 92, status: "Mastered" },
              { topic: "Syllogisms & Logic", domain: "Reasoning", mastery: 88, status: "Mastered" },
              { topic: "Array Manipulation", domain: "Programming", mastery: 80, status: "Proficient" },
              { topic: "Successive Discounts", domain: "Numerical", mastery: 74, status: "Proficient" },
              { topic: "Analytical SQL Joins", domain: "Database", mastery: 61, status: "Needs Practice" },
              { topic: "Recursion Pseudo-code", domain: "Technical", mastery: 54, status: "Focus Area" },
            ].map((item) => (
              <div key={item.topic} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.topic}</span>
                  <span className="font-bold text-blue-600">{item.mastery}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.mastery >= 80 ? "bg-emerald-500" : item.mastery >= 60 ? "bg-blue-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.domain}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
