"use client";

import React from "react";
import Link from "next/link";
import { Zap, Clock, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function StudentMockHubPage() {
  return (
    <AppShell role="STUDENT" title="Mock Assessments">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Company-Pattern Mock Assessment Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Realistic, timed mock examinations following strict corporate section structures and difficulty distributions.
          </p>
        </div>

        {/* Blueprint cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES_DATA.map((company) => (
            <div key={company.id} className="saas-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                    {company.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{company.blueprint.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-4">{company.name} Pattern Mock</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{company.description}</p>

                {/* Section breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Blueprint Sections:
                  </p>
                  {company.blueprint.sections.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs text-slate-600">
                      <span>{s.name}</span>
                      <span className="font-semibold text-slate-800">{s.questionCount} Qs</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deterministic server-side answer evaluation</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/student/mock/${company.slug}`}
                  className="w-full py-2.5 px-4 text-xs font-bold text-center block text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Start {company.name} Mock Exam</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
