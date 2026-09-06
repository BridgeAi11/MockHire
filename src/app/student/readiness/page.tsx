"use client";

import React from "react";
import Link from "next/link";
import { Award, Building2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";
import { getReadinessTier } from "@/lib/utils";

export default function StudentReadinessPage() {
  return (
    <AppShell role="STUDENT" title="Company Readiness">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Company-Specific Placement Readiness
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Readiness scores measure your assessment preparation and blueprint alignment across key hiring organizations.
          </p>
        </div>

        <div className="space-y-4">
          {COMPANIES_DATA.map((company) => {
            const score = company.slug === "tcs" ? 81 : company.slug === "infosys" ? 68 : company.slug === "accenture" ? 75 : company.slug === "wipro" ? 82 : 70;
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
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${tier.badgeClass}`}>
                        {score}% Readiness
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">{company.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                      <span>Pattern: {company.badge}</span>
                      <span>•</span>
                      <span>Cutoff Benchmark: {company.blueprint.cutoffScorePercent}%</span>
                      <span>•</span>
                      <span>Blueprint Duration: {company.blueprint.durationMinutes}m</span>
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
                    <span>Launch Mock</span>
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
