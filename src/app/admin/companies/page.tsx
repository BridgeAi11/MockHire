"use client";

import React, { useState } from "react";
import { Building2, Plus, Clock, HelpCircle, CheckCircle2, Edit2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState(COMPANIES_DATA);

  return (
    <AppShell role="ADMIN" title="Company Blueprint Configurations">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Company Assessment Blueprints
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage section compositions, time limits, question quotas, and negative marking ratios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div key={c.id} className="saas-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                    {c.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {c.blueprint.durationMinutes} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{c.name} Blueprint</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Section Quotas:</p>
                  {c.blueprint.sections.map((s) => (
                    <div key={s.name} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-semibold text-slate-800">{s.questionCount} Qs</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Negative Marking:</span>
                  <span className="font-semibold text-slate-800">
                    {c.blueprint.negativeMarking ? "Yes (-0.25)" : "None"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => alert(`Editing blueprint for ${c.name}`)}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configure Blueprint</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
