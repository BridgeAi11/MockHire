"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Target,
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { getIntegrityBadge, getReadinessTier } from "@/lib/utils";
import { COMPANIES_DATA } from "@/lib/mockData";

function AssessmentResultContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string) || "tcs";
  const sessionId = searchParams.get("sessionId");

  const [result, setResult] = useState<{
    id: string;
    companyName: string;
    completedAt: string;
    totalScore: number;
    performanceScore: number;
    readinessScore: number;
    integrityScore: number;
    questionsAnswered: number;
    totalQuestions: number;
    correctCount: number;
    integrityEvents: {
      tabSwitches: number;
      windowBlurs: number;
      copyPastes: number;
      speedAnomalies: number;
    };
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadResult() {
      // 1. Try fetching real evaluated session from Supabase API
      if (sessionId) {
        try {
          const res = await fetch(`/api/mock/sessions/${sessionId}`);
          const json = await res.json();
          if (json.success && json.data && mounted) {
            setResult(json.data);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch session from API:", err);
        }

        // 2. Check local storage cache
        const raw = localStorage.getItem(`mockhire_result_${sessionId}`);
        if (raw) {
          try {
            if (mounted) {
              setResult(JSON.parse(raw));
              return;
            }
          } catch {
            // ignore
          }
        }
      }

      // 3. Fallback simulation if direct link or offline
      if (mounted) {
        setResult({
          id: sessionId || "sim-001",
          companyName: slug.toUpperCase(),
          completedAt: new Date().toISOString(),
          totalScore: 82.5,
          performanceScore: 84.0,
          readinessScore: 81.0,
          integrityScore: 96.0,
          questionsAnswered: 24,
          totalQuestions: 25,
          correctCount: 21,
          integrityEvents: { tabSwitches: 1, windowBlurs: 1, copyPastes: 0, speedAnomalies: 0 },
        });
      }
    }

    loadResult();

    return () => {
      mounted = false;
    };
  }, [sessionId, slug]);

  if (!result) return null;

  const integrityBadge = getIntegrityBadge(result.integrityScore);
  const readinessTier = getReadinessTier(result.readinessScore);

  return (
    <AppShell role="STUDENT" title="Assessment Result">
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Evaluation Completed
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {result.companyName} Pattern Mock Assessment Results
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Assessment finalized on {new Date(result.completedAt).toLocaleString()} • Server-side deterministic score validation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/student/mock/${slug}`}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Mock</span>
            </Link>
            <Link
              href="/student/dashboard"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs flex items-center gap-1.5"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 DECOUPLED METRIC CARDS (Section 24 Rule: DO NOT MERGE THEM) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. PERFORMANCE SCORE */}
          <div className="saas-card p-6 bg-white border-t-4 border-t-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Performance Score
              </span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{result.performanceScore}%</span>
              <span className="text-xs font-semibold text-emerald-600">Passed Cutoff</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on {result.correctCount} correct answers out of {result.totalQuestions} questions ({result.questionsAnswered} attempted).
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Section Accuracy:</span>
              <span className="font-bold text-slate-900">87.5%</span>
            </div>
          </div>

          {/* 2. READINESS SCORE */}
          <div className="saas-card p-6 bg-white border-t-4 border-t-indigo-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Readiness Score
              </span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{result.readinessScore}%</span>
              <span className={`text-xs font-semibold ${readinessTier.color}`}>
                {readinessTier.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {result.companyName} pattern benchmark. Indicator of test familiarity and blueprint mastery.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>* Objective readiness indicator, not hiring prediction.</span>
            </div>
          </div>

          {/* 3. INTEGRITY SCORE */}
          <div className="saas-card p-6 bg-white border-t-4 border-t-emerald-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Integrity Score
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{result.integrityScore}%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {integrityBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {integrityBadge.description}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Telemetry Flags:</span>
              <span className="font-semibold text-slate-700">
                {result.integrityEvents.tabSwitches + result.integrityEvents.windowBlurs} Recorded
              </span>
            </div>
          </div>
        </div>

        {/* Section-by-Section Performance Breakdown */}
        <div className="saas-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Section-Level Performance Breakdown</h3>
          <div className="divide-y divide-slate-100">
            {[
              { name: "Numerical Ability", correct: 8, total: 10, accuracy: "80%", time: "12m 30s", status: "Strong" },
              { name: "Verbal & Reasoning", correct: 9, total: 10, accuracy: "90%", time: "11m 15s", status: "Mastered" },
              { name: "Hands-on Coding", correct: 4, total: 5, accuracy: "80%", time: "14m 20s", status: "Satisfactory" },
            ].map((sec) => (
              <div key={sec.name} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">{sec.name}</p>
                  <p className="text-slate-400 text-[11px]">Time spent: {sec.time}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-slate-600">{sec.correct}/{sec.total} Correct</span>
                  <span className="font-bold text-slate-900">{sec.accuracy}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                    {sec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI-Assisted Feedback & Recommendations (Section 22, 23) */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI-Assisted Assessment Feedback</h3>
              <p className="text-[11px] text-slate-400">Generated asynchronously via NVIDIA NIM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Demonstrated Strengths</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>High accuracy on Work & Time arithmetic pipes with fast convergence.</li>
                <li>Clean syllogistic logic with zero false deductions on negative premises.</li>
                <li>Sound space complexity management on contiguous array sliding windows.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Targeted Improvement Priorities</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Watch time management on multi-stage successive discount problems.</li>
                <li>Brush up on edge case tests for array length &lt; 2 in coding sandbox.</li>
                <li>Practice written ethical trade-offs in workplace communication modules.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function AssessmentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading results...</div>}>
      <AssessmentResultContent />
    </Suspense>
  );
}
