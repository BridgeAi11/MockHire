"use client";

import React from "react";
import Link from "next/link";
import { Building2, CalendarCheck, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function TPOCompaniesPage() {
  return (
    <AppShell role="TPO" title="Company Placement Blueprints">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Enterprise Assessment Blueprints
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review syllabus distributions, time limits, and test structures before scheduling campus drives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES_DATA.map((c) => (
            <div key={c.id} className="saas-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                    {c.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.blueprint.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{c.name} Assessment Track</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {c.blueprint.sections.map((sec) => (
                    <div key={sec.name} className="flex justify-between">
                      <span>{sec.name}</span>
                      <span className="font-semibold text-slate-800">{sec.questionCount} Questions</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/tpo/drives/create`}
                  className="w-full py-2 text-xs font-bold text-center block text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
                  Schedule {c.name} Mock Drive
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
