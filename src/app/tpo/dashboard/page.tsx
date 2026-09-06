"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/types";
import { DEMO_MOCK_DRIVES } from "@/lib/mockData";

export default function TPODashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.replace("/login");
    } else if (active.role !== "TPO" && active.role !== "ADMIN") {
      router.replace(`/${active.role.toLowerCase()}/dashboard`);
    } else {
      setUser(active);
    }
  }, [router]);

  return (
    <AppShell role="TPO" title="TPO Placement Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              {user?.collegeName || "RV College of Engineering"}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Placement Cell & Assessment Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live monitoring, student readiness distributions, and enterprise mock drives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tpo/students/import"
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Import CSV</span>
            </Link>
            <Link
              href="/tpo/drives/create"
              className="px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Schedule Mock Drive</span>
            </Link>
          </div>
        </div>

        {/* 6 High-Level TPO Metric Cards (Section 28) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Students"
            value="1,240"
            icon={Users}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="2025 Graduating Batch"
          />
          <StatCard
            title="Active Participants"
            value="892"
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="71.9% participation"
          />
          <StatCard
            title="Mocks Completed"
            value="3,450"
            icon={CheckCircle2}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="Across 5 company tracks"
          />
          <StatCard
            title="Average Score"
            value="74.2%"
            trend={{ value: "3.1%", isPositive: true }}
            icon={BarChart3}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="College benchmark"
          />
          <StatCard
            title="Average Readiness"
            value="72.8%"
            icon={Award}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Target: 75% for drives"
          />
          <StatCard
            title="Needs Attention"
            value="48"
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Readiness < 55%"
          />
        </div>

        {/* Mock Drives Overview */}
        <div className="saas-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Campus Mock Drives</h3>
              <p className="text-xs text-slate-500">Scheduled and active placement mock drives.</p>
            </div>
            <Link href="/tpo/drives" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All Drives
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_MOCK_DRIVES.map((drv) => (
              <div
                key={drv.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{drv.driveName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        drv.status === "LIVE"
                          ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                          : drv.status === "SCHEDULED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {drv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Company: <strong className="text-slate-700">{drv.companyName}</strong> • Scheduled:{" "}
                    {new Date(drv.scheduledAt).toLocaleDateString()} • {drv.durationMinutes} mins duration
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {drv.studentsCompleted} / {drv.totalStudentsAssigned} Completed
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Avg Score: {drv.averageScore ? `${drv.averageScore}%` : "Pending"}
                    </p>
                  </div>

                  {drv.status === "LIVE" ? (
                    <Link
                      href={`/tpo/drives/${drv.id}/monitor`}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                    >
                      Live Monitor
                    </Link>
                  ) : (
                    <Link
                      href={`/tpo/drives/${drv.id}/results`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns: College-Wide Weak Areas & Department Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weak Areas Heatmap (Section 34) */}
          <div className="lg:col-span-6 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Curriculum Proficiency Heatmap</h3>
              <span className="text-[11px] text-slate-500">Guides placement training</span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated section scores across all campus assessments:
            </p>

            <div className="space-y-3">
              {[
                { section: "Quantitative Aptitude", score: 72, label: "Proficient" },
                { section: "Logical Reasoning", score: 78, label: "Strong" },
                { section: "Verbal Communication", score: 68, label: "Moderate" },
                { section: "Technical Core & SQL", score: 54, label: "Action Required" },
                { section: "Data Structures & Coding", score: 58, label: "Action Required" },
              ].map((sec) => (
                <div key={sec.section} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sec.section}</span>
                    <span className="font-bold text-slate-900">{sec.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sec.score >= 70 ? "bg-emerald-500" : sec.score >= 60 ? "bg-blue-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${sec.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>TPO Recommendation:</strong> Organize hands-on SQL and Array logic workshops prior to the upcoming Cognizant & Infosys drives.
              </span>
            </div>
          </div>

          {/* Department Readiness Summary */}
          <div className="lg:col-span-6 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Branch-wise Readiness</h3>
              <Link href="/tpo/reports" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Export Report
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                { dept: "Computer Science & Engineering", count: 420, avgScore: "81.2%", ready: 340 },
                { dept: "Information Science & Engg", count: 280, avgScore: "78.4%", ready: 218 },
                { dept: "Electronics & Communication", count: 320, avgScore: "71.0%", ready: 198 },
                { dept: "Electrical & Electronics", count: 220, avgScore: "66.5%", ready: 124 },
              ].map((d) => (
                <div key={d.dept} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{d.dept}</p>
                    <p className="text-[11px] text-slate-400">{d.count} candidates enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{d.avgScore} Avg</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{d.ready} Drive Ready</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
