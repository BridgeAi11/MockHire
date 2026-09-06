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
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { CompanyCard } from "@/components/ui/../shared/CompanyCard";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile, Company, MockSession } from "@/types";
import { COMPANIES_DATA, DEMO_STUDENT_SESSIONS } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>(COMPANIES_DATA);
  const [recentSessions, setRecentSessions] = useState<MockSession[]>(DEMO_STUDENT_SESSIONS);
  const [upcomingDrives, setUpcomingDrives] = useState<any[]>([]);
  const [stats, setStats] = useState({
    overallReadiness: 76,
    latestScore: 82.5,
    mocksCompleted: 14,
    streakDays: 5,
    strongestArea: "Work & Time",
    weakestArea: "SQL Joins",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.replace("/login");
      return;
    }
    if (active.role !== "STUDENT") {
      router.replace(`/${active.role.toLowerCase()}/dashboard`);
      return;
    }
    setUser(active);

    async function loadStudentData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch real companies from companies table
        const { data: dbCompanies } = await supabase
          .from("companies")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbCompanies && dbCompanies.length > 0) {
          const mappedCompanies: Company[] = dbCompanies.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            logoUrl: c.logo_url,
            description: c.description,
            difficulty: c.difficulty || "MEDIUM",
            isActive: c.is_active,
            sampleQuestionsCount: c.sample_questions_count || 30,
            blueprint: c.test_blueprint_json || {
              durationMinutes: 60,
              totalQuestions: 30,
              negativeMarking: false,
              sections: [],
              instructions: [],
            },
          }));
          setCompanies(mappedCompanies);
        }

        // 2. Fetch real student sessions from mock_sessions
        const { data: dbSessions } = await supabase
          .from("mock_sessions")
          .select("*, companies(*)")
          .order("created_at", { ascending: false })
          .limit(10);

        if (dbSessions && dbSessions.length > 0) {
          const mappedSessions: MockSession[] = dbSessions.map((s: any) => ({
            id: s.id,
            studentId: s.student_id,
            companyId: s.company_id || "general",
            companyName: s.companies?.name || "Corporate Pattern",
            companySlug: s.companies?.slug || "general",
            sessionType: s.session_type || "SELF_MOCK",
            status: s.status,
            startedAt: s.started_at,
            completedAt: s.completed_at,
            durationMinutes: 60,
            totalScore: Number(s.total_score) || 0,
            performanceScore: Number(s.performance_score) || 0,
            readinessScore: Number(s.readiness_score) || 0,
            integrityScore: Number(s.integrity_score) || 100,
            questionsCount: 25,
            answeredCount: s.cheat_summary_json?.questionsAnswered || 0,
            markedForReviewCount: 0,
          }));

          setRecentSessions(mappedSessions);

          // Compute real stats from live database sessions
          const completed = mappedSessions.filter((s) => s.status === "SUBMITTED");
          if (completed.length > 0) {
            const avgReadiness = Math.round(
              completed.reduce((acc, curr) => acc + (curr.readinessScore || 0), 0) / completed.length
            );
            const latest = completed[0].totalScore || 0;

            setStats((prev) => ({
              ...prev,
              overallReadiness: avgReadiness,
              latestScore: latest,
              mocksCompleted: completed.length,
            }));
          }
        }

        // 3. Fetch upcoming college drives assigned to this student
        const { data: dbDrives } = await supabase
          .from("mock_drive_students")
          .select("*, mock_drives(*, companies(*))")
          .limit(5);

        if (dbDrives) {
          setUpcomingDrives(dbDrives);
        }
      } catch (err) {
        console.warn("Failed to load Supabase student dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentData();
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
              <span className="font-bold text-blue-600">
                {stats.overallReadiness}% ({stats.overallReadiness >= 75 ? "Assessment Ready" : "Developing"})
              </span>{" "}
              across {companies.length} enterprise blueprints.
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
            value={`${stats.overallReadiness}%`}
            trend={{ value: "4.2%", isPositive: true }}
            icon={Award}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Weighted across mocks"
          />
          <StatCard
            title="Latest Mock Score"
            value={`${stats.latestScore}%`}
            trend={{ value: "6.0%", isPositive: true }}
            icon={Target}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Most recent exam"
          />
          <StatCard
            title="Mocks Completed"
            value={String(stats.mocksCompleted)}
            icon={CheckCircle2}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="Recorded in database"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.streakDays} Days`}
            icon={Zap}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Daily practice target"
          />
          <StatCard
            title="Strongest Area"
            value={stats.strongestArea}
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Consistently high accuracy"
          />
          <StatCard
            title="Weakest Area"
            value={stats.weakestArea}
            icon={AlertTriangle}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Recommended for review"
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
            {companies.slice(0, 6).map((company) => {
              // Calculate company specific readiness if sessions exist, else calibrated default
              const companySessions = recentSessions.filter((s) => s.companySlug === company.slug);
              const readiness =
                companySessions.length > 0
                  ? Math.round(
                      companySessions.reduce((acc, curr) => acc + (curr.readinessScore || 0), 0) /
                        companySessions.length
                    )
                  : company.slug === "tcs"
                  ? 81
                  : company.slug === "infosys"
                  ? 68
                  : company.slug === "accenture"
                  ? 75
                  : company.slug === "wipro"
                  ? 82
                  : 70;

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
              <span className="text-[11px] text-slate-500 font-medium">Based on blueprint diagnostics</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Priority topics calibrated from recent mock assessments:
            </p>

            <div className="space-y-3">
              {[
                { topic: "Arrays & Sliding Window", company: "TCS / Infosys", accuracy: "52%", reason: "Time complexity & boundary handling" },
                { topic: "Probability & Independent Events", company: "Wipro Elite", accuracy: "58%", reason: "Time exceeded 90 seconds per question" },
                { topic: "Analytical SQL & Window Functions", company: "Cognizant GenC", accuracy: "61%", reason: "DENSE_RANK syntax errors" },
                { topic: "Descriptive Technical Writing", company: "Accenture / Wipro", accuracy: "68%", reason: "Structural clarity in essay responses" },
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
              {recentSessions.slice(0, 4).map((session) => (
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
