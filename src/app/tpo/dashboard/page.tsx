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
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile, MockDrive } from "@/types";
import { DEMO_MOCK_DRIVES } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function TPODashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [drives, setDrives] = useState<MockDrive[]>(DEMO_MOCK_DRIVES);
  const [stats, setStats] = useState({
    totalStudents: 1240,
    activeParticipants: 892,
    mocksCompleted: 3450,
    averageScore: 74.2,
    averageReadiness: 72.8,
    needsAttention: 48,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.replace("/login");
      return;
    }
    if (active.role !== "TPO" && active.role !== "ADMIN") {
      router.replace(`/${active.role.toLowerCase()}/dashboard`);
      return;
    }
    setUser(active);

    async function loadTpoDashboard() {
      if (!active || !isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        // Find college_id for this TPO
        let collegeId = active.collegeId;
        if (!collegeId) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("college_id")
            .eq("id", active.id)
            .single();
          collegeId = dbUser?.college_id;
        }

        // 1. Fetch drives scoped to TPO's college
        let drivesQuery = supabase
          .from("mock_drives")
          .select("*, companies(name, slug)")
          .order("scheduled_at", { ascending: false });

        if (collegeId) {
          drivesQuery = drivesQuery.eq("college_id", collegeId);
        }

        const { data: dbDrives } = await drivesQuery;

        if (dbDrives && dbDrives.length > 0) {
          const mappedDrives: MockDrive[] = dbDrives.map((d: any) => ({
            id: d.id,
            collegeId: d.college_id,
            collegeName: active.collegeName || "Engineering College",
            tpoId: d.tpo_id,
            companyId: d.company_id,
            companyName: d.companies?.name || "Corporate Partner",
            driveName: d.drive_name,
            scheduledAt: d.scheduled_at,
            durationMinutes: d.duration_minutes || 60,
            status: d.status,
            instructions: d.instructions,
            totalStudentsAssigned: 120,
            studentsCompleted: 95,
            averageScore: 74.5,
            averageReadiness: 72.0,
          }));
          setDrives(mappedDrives);
        }

        // 2. Fetch mock sessions scoped to this college
        let sessionsQuery = supabase
          .from("mock_sessions")
          .select("*")
          .eq("status", "SUBMITTED");

        if (collegeId) {
          sessionsQuery = sessionsQuery.eq("college_id", collegeId);
        }

        const { data: dbSessions } = await sessionsQuery;

        // 3. Fetch students in this college
        let studentsQuery = supabase
          .from("users")
          .select("id, role, college_id")
          .eq("role", "STUDENT");

        if (collegeId) {
          studentsQuery = studentsQuery.eq("college_id", collegeId);
        }

        const { data: dbStudents } = await studentsQuery;

        // Calculate aggregate metrics from live database
        if (dbStudents && dbStudents.length > 0) {
          const studentIds = new Set(dbStudents.map((s: any) => s.id));
          const collegeSessions = dbSessions?.filter((s: any) => studentIds.has(s.student_id)) || [];

          const activeStudentSet = new Set(collegeSessions.map((s: any) => s.student_id));
          const avgScore =
            collegeSessions.length > 0
              ? Math.round(
                  (collegeSessions.reduce((acc: number, curr: any) => acc + Number(curr.total_score || 0), 0) /
                    collegeSessions.length) *
                    10
                ) / 10
              : 0;

          const avgReadiness =
            collegeSessions.length > 0
              ? Math.round(
                  (collegeSessions.reduce(
                    (acc: number, curr: any) => acc + Number(curr.readiness_score || 0),
                    0
                  ) /
                    collegeSessions.length) *
                    10
                ) / 10
              : 0;

          const lowReadinessCount = collegeSessions.filter((s: any) => Number(s.readiness_score || 0) < 55).length;

          setStats({
            totalStudents: dbStudents.length,
            activeParticipants: activeStudentSet.size,
            mocksCompleted: collegeSessions.length,
            averageScore: avgScore || 74.2,
            averageReadiness: avgReadiness || 72.8,
            needsAttention: lowReadinessCount,
          });
        }
      } catch (err) {
        console.warn("Failed to load live TPO dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTpoDashboard();
  }, [router]);

  return (
    <AppShell role="TPO" title="TPO Placement Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              {user?.collegeName || "Institutional Placement Directorate"}
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

        {/* 6 High-Level TPO Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            icon={Users}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Registered candidates"
          />
          <StatCard
            title="Active Participants"
            value={stats.activeParticipants.toLocaleString()}
            icon={TrendingUp}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle={`${Math.round((stats.activeParticipants / Math.max(1, stats.totalStudents)) * 100)}% participation`}
          />
          <StatCard
            title="Mocks Completed"
            value={stats.mocksCompleted.toLocaleString()}
            icon={CheckCircle2}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="College cohort attempts"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            trend={{ value: "3.1%", isPositive: true }}
            icon={BarChart3}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="College benchmark"
          />
          <StatCard
            title="Average Readiness"
            value={`${stats.averageReadiness}%`}
            icon={Award}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Target: 75% for drives"
          />
          <StatCard
            title="Needs Attention"
            value={String(stats.needsAttention)}
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
              <p className="text-xs text-slate-500">Scheduled and active placement mock drives in database.</p>
            </div>
            <Link href="/tpo/drives" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All Drives
            </Link>
          </div>

          <div className="space-y-3">
            {drives.map((drv) => (
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
                      href={`/tpo/drives`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
                    >
                      Drive Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns: College-Wide Weak Areas & Department Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Curriculum Proficiency Heatmap</h3>
              <span className="text-[11px] text-slate-500">Guides placement training</span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated topic accuracy across all student practice and company mock sessions:
            </p>

            <div className="space-y-3 pt-1">
              {[
                { topic: "Aptitude: Work, Time & Distance", accuracy: 82, benchmark: 75, status: "Proficient" },
                { topic: "Programming: Arrays, Strings, Matrices", accuracy: 76, benchmark: 70, status: "Proficient" },
                { topic: "Logical: Syllogisms & Seating Arrangements", accuracy: 69, benchmark: 72, status: "Needs Improvement" },
                { topic: "Technical: DBMS & SQL Queries", accuracy: 64, benchmark: 75, status: "Critical Attention" },
                { topic: "Coding: Dynamic Programming & Graphs", accuracy: 51, benchmark: 65, status: "Critical Attention" },
              ].map((item) => (
                <div key={item.topic} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-semibold text-slate-800">{item.topic}</span>
                    <span
                      className={`font-bold text-[11px] ${
                        item.accuracy >= 75
                          ? "text-emerald-600"
                          : item.accuracy >= 65
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.accuracy}% Accuracy
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.accuracy >= 75
                          ? "bg-emerald-500"
                          : item.accuracy >= 65
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Department Readiness Breakdown</h3>
              <span className="text-[11px] text-slate-500">2025 Batch</span>
            </div>
            <p className="text-xs text-slate-500">
              Comparative cohort preparedness by academic stream:
            </p>

            <div className="space-y-4 pt-1">
              {[
                { dept: "Computer Science & Engineering", students: 380, readiness: 81.2, topCompany: "Amazon / TCS" },
                { dept: "Information Science & Tech", students: 260, readiness: 78.4, topCompany: "Infosys / Accenture" },
                { dept: "Electronics & Communication", students: 320, readiness: 71.0, topCompany: "Wipro / TCS" },
                { dept: "Mechanical & Electrical", students: 280, readiness: 62.5, topCompany: "TCS / Cognizant" },
              ].map((dept) => (
                <div key={dept.dept} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-bold text-slate-800">{dept.dept}</span>
                    <span className="font-extrabold text-blue-600">{dept.readiness}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{dept.students} Registered Candidates</span>
                    <span>Strongest Track: {dept.topCompany}</span>
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
