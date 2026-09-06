"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
  Users,
  Building2,
  Layers,
  ClipboardList,
  Cpu,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/types";
import { CURATED_QUESTIONS_BANK } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    collegesCount: 14,
    studentsCount: 3850,
    companiesCount: 5,
    questionsCount: CURATED_QUESTIONS_BANK.length,
    publishedQuestionsCount: CURATED_QUESTIONS_BANK.length,
    underReviewQuestionsCount: 0,
    draftQuestionsCount: 0,
    sessionsCount: 0,
    aiJobsCount: 0,
    telemetryFlagsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getCurrentUser();
    if (!active) {
      router.replace("/login");
    } else if (active.role !== "ADMIN") {
      router.replace(`/${active.role.toLowerCase()}/dashboard`);
    } else {
      setUser(active);
    }

    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setStats(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  return (
    <AppShell role="ADMIN" title="Platform Administration">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              MockHire Central Governance
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Platform Overview & Question Bank Health
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated pattern banks, enterprise blueprint management, institutional licensing, and AI job queues.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/questions/create"
              className="px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Curated Question</span>
            </Link>
          </div>
        </div>

        {/* 7 High-Level Admin Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard
            title="Total Colleges"
            value={stats.collegesCount.toString()}
            icon={School}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Partner Institutions"
          />
          <StatCard
            title="Total Students"
            value={stats.studentsCount.toLocaleString()}
            icon={Users}
            iconColor="text-indigo-600 bg-indigo-50"
            subtitle="Registered Candidates"
          />
          <StatCard
            title="Active Companies"
            value={stats.companiesCount.toString()}
            icon={Building2}
            iconColor="text-purple-600 bg-purple-50"
            subtitle="Enterprise Patterns"
          />
          <StatCard
            title="Total Questions"
            value={stats.questionsCount.toString()}
            icon={Layers}
            iconColor="text-emerald-600 bg-emerald-50"
            subtitle="Curated, Zero AI"
          />
          <StatCard
            title="Mock Sessions"
            value={stats.sessionsCount.toString()}
            icon={ClipboardList}
            iconColor="text-blue-600 bg-blue-50"
            subtitle="Completed mocks"
          />
          <StatCard
            title="AI Jobs Queue"
            value={stats.aiJobsCount.toString()}
            icon={Cpu}
            iconColor="text-amber-600 bg-amber-50"
            subtitle="Active async jobs"
          />
          <StatCard
            title="Flagged Telemetry"
            value={stats.telemetryFlagsCount.toString()}
            icon={ShieldAlert}
            iconColor="text-rose-600 bg-rose-50"
            subtitle="Integrity alerts"
          />
        </div>

        {/* Two Columns: Question Bank Health & AI Async Queue Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Curated Question Bank Lifecycle Status */}
          <div className="lg:col-span-7 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Question Bank Lifecycle & Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Curated questions adhere strictly to human-verified corporate pattern standards.
                </p>
              </div>
              <Link
                href="/admin/questions"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage Bank
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Published</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">{stats.publishedQuestionsCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] text-amber-600 font-bold uppercase">Under Review</p>
                <p className="text-xl font-extrabold text-amber-700 mt-1">{stats.underReviewQuestionsCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Draft</p>
                <p className="text-xl font-extrabold text-slate-700 mt-1">{stats.draftQuestionsCount}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strict Policy: Zero AI Question Generation</span>
              </p>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                All live questions in MockHire originate from verified alumni recollections, company pattern blueprints, and faculty SMEs. Evaluator keys are stored securely server-side.
              </p>
            </div>
          </div>

          {/* AI Jobs Monitor Status (Section 43) */}
          <div className="lg:col-span-5 saas-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">NVIDIA NIM AI Worker Health</h3>
              <Link href="/admin/ai-jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View Queue
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: "Descriptive Essay Feedback", status: "PROCESSING", latency: "1.2s", queue: 4 },
                { name: "Coding Logic & Complexity Explainer", status: "PROCESSING", latency: "1.8s", queue: 6 },
                { name: "Communication Rubric Scoring", status: "IDLE", latency: "0.9s", queue: 2 },
              ].map((svc) => (
                <div key={svc.name} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{svc.name}</p>
                    <p className="text-[11px] text-slate-400">Avg Latency: {svc.latency} • {svc.queue} queued</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>BullMQ Queue worker operational with auto-retries.</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
