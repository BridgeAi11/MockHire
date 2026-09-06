"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  Zap,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Sparkles,
  Building2,
  BarChart2,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { CompanyCard } from "@/components/ui/../shared/CompanyCard";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile, Company } from "@/types";
import { COMPANIES_DATA, DEMO_STUDENT_SESSIONS } from "@/lib/mockData";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.replace("/login");
    } else if (active.role !== "STUDENT") {
      router.replace(`/${active.role.toLowerCase()}/dashboard`);
    } else {
      setUser(active);
    }
  }, [router]);

  const handleTakeMock = (company: Company) => {
    router.push(`/student/mock/${company.slug}`);
  };

  return (
    <AppShell role="STUDENT" title="Student Dashboard">
      <div className="space-y-8">
        {/* Welcome Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Good morning, {user?.fullName || "Candidate"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your overall placement assessment readiness stands at{" "}
              <span className="font-bold text-blue-600">76% (Assessment Ready)</span> across 5 enterprise blueprints.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/student/mock"
              className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Timed Mock</span>
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Overall Readiness"
            value="76%"
            trend={{ value: "4.2%", isPositive: true }}
            icon={Award}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Weighted across mocks"
          />
          <StatCard
            title="Latest Mock Score"
            value="82.5%"
            trend={{ value: "6.0%", isPositive: true }}
            icon={Target}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="TCS NQT Pattern"
          />
          <StatCard
            title="Mocks Completed"
            value="14"
            icon={CheckCircle2}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="Across 4 companies"
          />
          <StatCard
            title="Current Streak"
            value="5 Days"
            icon={Zap}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Daily practice target"
          />
          <StatCard
            title="Strongest Area"
            value="Work & Time"
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="91% accuracy"
          />
          <StatCard
            title="Weakest Area"
            value="SQL Joins"
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Needs revision"
          />
        </div>

        {/* Company Readiness Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Company-Pattern Readiness</h3>
              <p className="text-xs text-slate-500">
                Calibrated readiness scores based on specific recruitment blueprints and recent test results.
              </p>
            </div>
            <Link
              href="/student/companies"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all companies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANIES_DATA.map((company) => {
              const readiness = company.slug === "tcs" ? 81 : company.slug === "infosys" ? 68 : company.slug === "accenture" ? 75 : company.slug === "wipro" ? 82 : 70;
              return (
                <CompanyCard
                  key={company.id}
                  company={company}
                  readinessScore={readiness}
                  onTakeMock={handleTakeMock}
                />
              );
            })}
          </div>
        </div>

        {/* Two Columns: Recommended Practice & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recommended Practice */}
          <div className="lg:col-span-6 saas-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Personalized Practice Priorities</h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Based on recent mistakes</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Our blueprint diagnostics identified 4 specific topics dragging down your composite readiness:
            </p>

            <div className="space-y-3">
              {[
                { topic: "Arrays & Sliding Window", company: "TCS / Infosys", accuracy: "52%", reason: "Failed consecutive subarray logic in Mock #12" },
                { topic: "Probability & Independent Events", company: "Wipro Elite", accuracy: "58%", reason: "Time exceeded 90 seconds per question" },
                { topic: "Analytical SQL & Window Functions", company: "Cognizant GenC", accuracy: "61%", reason: "DENSE_RANK syntax errors" },
                { topic: "Descriptive Technical Writing", company: "Accenture / Wipro", accuracy: "68%", reason: "Needs crisper ethical reasoning in essays" },
              ].map((rec) => (
                <div key={rec.topic} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rec.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                        {rec.company}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rec.reason}</p>
                  </div>
                  <Link
                    href={`/student/practice?topic=${encodeURIComponent(rec.topic)}`}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition shrink-0"
                  >
                    Practice Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mock & Practice Activity */}
          <div className="lg:col-span-6 saas-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Recent Assessment Activity</h4>
              </div>
              <Link href="/student/history" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View Full History
              </Link>
            </div>

            <div className="space-y-3">
              {DEMO_STUDENT_SESSIONS.map((session) => (
                <div key={session.id} className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{session.companyName} Mock Assessment</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Score: {session.totalScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Completed on {new Date(session.completedAt || session.startedAt).toLocaleDateString()} • {session.durationMinutes} mins duration
                      </p>
                    </div>

                    <Link
                      href={`/student/mock/${session.companySlug}/result?sessionId=${session.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Analysis</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Decoupled score indicators */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>Performance: <span className="font-semibold text-slate-800">{session.performanceScore}%</span></div>
                    <div>Readiness: <span className="font-semibold text-slate-800">{session.readinessScore}%</span></div>
                    <div>Integrity: <span className="font-semibold text-emerald-600">Normal (Clean)</span></div>
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
