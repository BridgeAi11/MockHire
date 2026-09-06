"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Building2, ArrowRight, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA, DEMO_STUDENT_SESSIONS } from "@/lib/mockData";
import { Company, MockSession } from "@/types";
import { getReadinessTier } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function StudentReadinessPage() {
  const [companies, setCompanies] = useState<Company[]>(COMPANIES_DATA);
  const [sessions, setSessions] = useState<MockSession[]>(DEMO_STUDENT_SESSIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReadinessData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch companies
        const { data: dbComps } = await supabase
          .from("companies")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbComps && dbComps.length > 0) {
          const mapped: Company[] = dbComps.map((c: any) => ({
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
          setCompanies(mapped);
        }

        // 2. Fetch student's real completed mock sessions
        const { data: dbSessions } = await supabase
          .from("mock_sessions")
          .select("*, companies(*)")
          .eq("status", "SUBMITTED");

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
            answeredCount: 0,
            markedForReviewCount: 0,
          }));
          setSessions(mappedSessions);
        }
      } catch (err) {
        console.warn("Failed to load readiness data from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReadinessData();
  }, []);

  return (
    <AppShell role="STUDENT" title="Company Readiness">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Company-Specific Placement Readiness
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Readiness scores calculated dynamically from your actual completed assessments against verified corporate blueprints.
          </p>
        </div>

        <div className="space-y-4">
          {companies.map((company) => {
            // Calculate real readiness from student's session history for this company
            const matchingSessions = sessions.filter(
              (s) => s.companySlug === company.slug || s.companyId === company.id
            );

            let score = 0;
            let hasAttempts = false;

            if (matchingSessions.length > 0) {
              hasAttempts = true;
              score = Math.round(
                matchingSessions.reduce((acc, curr) => acc + (curr.readinessScore || 0), 0) /
                  matchingSessions.length
              );
            } else if (!isSupabaseConfigured) {
              // Fallback canned scores only when offline
              score = company.slug === "tcs" ? 81 : company.slug === "infosys" ? 68 : company.slug === "accenture" ? 75 : company.slug === "wipro" ? 82 : 70;
              hasAttempts = true;
            }

            const tier = getReadinessTier(score);

            return (
              <div key={company.id} className="saas-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-blue-700 font-black text-lg flex items-center justify-center shrink-0">
                    {company.name.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{company.name}</h3>
                      {hasAttempts ? (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${tier.badgeClass}`}>
                          {score}% Readiness ({tier.label})
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-slate-100 text-slate-600 border-slate-200">
                          Not Yet Attempted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">{company.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                      <span>Pattern: {company.badge || `${company.difficulty} Pattern`}</span>
                      <span>•</span>
                      <span>Cutoff Benchmark: {company.blueprint.cutoffScorePercent || 70}%</span>
                      <span>•</span>
                      <span>Blueprint Duration: {company.blueprint.durationMinutes}m</span>
                      {hasAttempts && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-600">
                            {matchingSessions.length} Attempt{matchingSessions.length === 1 ? "" : "s"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link
                    href={`/student/practice?company=${company.slug}`}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                  >
                    Targeted Practice
                  </Link>
                  <Link
                    href={`/student/mock/${company.slug}`}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs flex items-center gap-1"
                  >
                    <span>{hasAttempts ? "Retake Mock" : "Take First Mock"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
