"use client";

import React from "react";
import { Award, Building2, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function TPOReadinessPage() {
  const companyReadinessStats = [
    { company: "TCS (NQT Track)", assessed: 320, avgReadiness: 78.4, ready: 245, needsPractice: 60, atRisk: 15 },
    { company: "Infosys (Specialist Track)", assessed: 280, avgReadiness: 69.2, ready: 172, needsPractice: 88, atRisk: 20 },
    { company: "Accenture (Cognitive & Tech)", assessed: 250, avgReadiness: 75.1, ready: 190, needsPractice: 48, atRisk: 12 },
    { company: "Wipro (Elite NLTH)", assessed: 310, avgReadiness: 81.6, ready: 260, needsPractice: 42, atRisk: 8 },
    { company: "Cognizant (GenC Track)", assessed: 220, avgReadiness: 71.8, ready: 154, needsPractice: 52, atRisk: 14 },
  ];

  return (
    <AppShell role="TPO" title="Campus Placement Readiness">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Company-Wise Cohort Placement Readiness
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate campus preparedness indicators mapped to enterprise assessment patterns.
          </p>
        </div>

        {/* Company Cohort Breakdown Cards */}
        <div className="space-y-4">
          {companyReadinessStats.map((item) => (
            <div key={item.company} className="saas-card p-6 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {item.company.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.company}</h3>
                    <p className="text-[11px] text-slate-400">{item.assessed} students assessed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Average Readiness:</span>
                  <span className="text-base font-extrabold text-blue-600">{item.avgReadiness}%</span>
                </div>
              </div>

              {/* Progress split bar */}
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
                    <span>Drive Ready: <strong>{item.ready}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Needs Practice: <strong>{item.needsPractice}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>At Risk: <strong>{item.atRisk}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
