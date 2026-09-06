"use client";

import React, { useState, useEffect } from "react";
import { Award, Building2, AlertTriangle, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface CompanyCohortStat {
  company: string;
  slug: string;
  assessed: number;
  avgReadiness: number;
  ready: number;
  needsPractice: number;
  atRisk: number;
}

const FALLBACK_STATS: CompanyCohortStat[] = [
  { company: "TCS (NQT Track)", slug: "tcs", assessed: 320, avgReadiness: 78.4, ready: 245, needsPractice: 60, atRisk: 15 },
  { company: "Infosys (Specialist Track)", slug: "infosys", assessed: 280, avgReadiness: 69.2, ready: 172, needsPractice: 88, atRisk: 20 },
  { company: "Accenture (Cognitive & Tech)", slug: "accenture", assessed: 250, avgReadiness: 75.1, ready: 190, needsPractice: 48, atRisk: 12 },
  { company: "Wipro (Elite NLTH)", slug: "wipro", assessed: 310, avgReadiness: 81.6, ready: 260, needsPractice: 42, atRisk: 8 },
  { company: "Amazon (SDE-1 Track)", slug: "amazon", assessed: 180, avgReadiness: 68.5, ready: 95, needsPractice: 65, atRisk: 20 },
];

export default function TPOReadinessPage() {
  const [stats, setStats] = useState<CompanyCohortStat[]>(FALLBACK_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReadinessAnalytics() {
      const active = getCurrentUser();
      if (!isSupabaseConfigured || !active) {
        setIsLoading(false);
        return;
      }

      try {
        let collegeId = active.collegeId;
        if (!collegeId) {
          const { data: dbUser } = await supabase
            .from("users")
            .select("college_id")
            .eq("id", active.id)
            .single();
          collegeId = dbUser?.college_id;
        }

        // 1. Fetch companies
        const { data: dbComps } = await supabase
          .from("companies")
          .select("id, name, slug")
          .eq("is_active", true);

        // 2. Fetch mock_sessions scoped to this college
        let sessionsQuery = supabase
          .from("mock_sessions")
          .select("id, company_id, readiness_score, companies(name, slug)")
          .eq("status", "SUBMITTED");

        if (collegeId) {
          sessionsQuery = sessionsQuery.eq("college_id", collegeId);
        }

        const { data: dbSessions } = await sessionsQuery;

        if (dbComps && dbComps.length > 0 && dbSessions && dbSessions.length > 0) {
          const computed: CompanyCohortStat[] = dbComps.map((comp: any) => {
            const compSessions = dbSessions.filter(
              (s: any) => s.company_id === comp.id || s.companies?.slug === comp.slug
            );

            if (compSessions.length === 0) {
              return {
                company: comp.name,
                slug: comp.slug,
                assessed: 0,
                avgReadiness: 0,
                ready: 0,
                needsPractice: 0,
                atRisk: 0,
              };
            }

            const total = compSessions.length;
            const avg = Math.round(
              compSessions.reduce((acc: number, curr: any) => acc + Number(curr.readiness_score || 0), 0) /
                total
            );
            const readyCount = compSessions.filter((s: any) => Number(s.readiness_score || 0) >= 75).length;
            const needsCount = compSessions.filter(
              (s: any) => Number(s.readiness_score || 0) >= 55 && Number(s.readiness_score || 0) < 75
            ).length;
            const atRiskCount = compSessions.filter((s: any) => Number(s.readiness_score || 0) < 55).length;

            return {
              company: comp.name,
              slug: comp.slug,
              assessed: total,
              avgReadiness: avg,
              ready: readyCount,
              needsPractice: needsCount,
              atRisk: atRiskCount,
            };
          });

          // Only replace if we have assessed data, else keep fallback
          const hasAssessed = computed.some((c) => c.assessed > 0);
          if (hasAssessed) {
            setStats(computed);
          }
        }
      } catch (err) {
        console.warn("Failed to load live cohort readiness analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReadinessAnalytics();
  }, []);

  return (
    <AppShell role="TPO" title="Campus Placement Readiness">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Company-Wise Cohort Placement Readiness
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate campus preparedness indicators mapped to enterprise assessment patterns from your college database.
          </p>
        </div>

        {/* Company Cohort Breakdown Cards */}
        <div className="space-y-4">
          {stats.map((item) => {
            const hasAssessed = item.assessed > 0;
            return (
              <div key={item.slug || item.company} className="saas-card p-6 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm">
                      {item.company.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.company}</h3>
                      <p className="text-[11px] text-slate-400">
                        {item.assessed} candidate{item.assessed === 1 ? "" : "s"} assessed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Average Readiness:</span>
                    <span className="text-base font-extrabold text-blue-600">
                      {hasAssessed ? `${item.avgReadiness}%` : "Pending Assessments"}
                    </span>
                  </div>
                </div>

                {/* Progress split bar */}
                {hasAssessed ? (
                  <div className="space-y-1.5">
                    <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                      <div
                        style={{ width: `${(item.ready / item.assessed) * 100}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Ready: ${item.ready}`}
                      />
                      <div
                        style={{ width: `${(item.needsPractice / item.assessed) * 100}%` }}
                        className="bg-blue-500 h-full"
                        title={`Needs Practice: ${item.needsPractice}`}
                      />
                      <div
                        style={{ width: `${(item.atRisk / item.assessed) * 100}%` }}
                        className="bg-rose-500 h-full"
                        title={`At Risk: ${item.atRisk}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Drive Ready (≥75%): <strong>{item.ready}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Needs Practice (55-74%): <strong>{item.needsPractice}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>At Risk (&lt;55%): <strong>{item.atRisk}</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No students have completed assessments for this blueprint yet. Schedule a mock drive to collect readiness telemetry.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
