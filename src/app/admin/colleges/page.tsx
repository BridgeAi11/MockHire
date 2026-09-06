"use client";

import React from "react";
import { School, Search, CheckCircle2, Award } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

export default function AdminCollegesPage() {
  const colleges = [
    { name: "RV College of Engineering", code: "RVCE", city: "Bengaluru", state: "Karnataka", plan: "GROWTH", students: 1240, status: "ACTIVE" },
    { name: "BMS College of Engineering", code: "BMSCE", city: "Bengaluru", state: "Karnataka", plan: "GROWTH", students: 980, status: "ACTIVE" },
    { name: "PSG College of Technology", code: "PSGTECH", city: "Coimbatore", state: "Tamil Nadu", plan: "INSTITUTION", students: 1850, status: "ACTIVE" },
    { name: "VJTI Mumbai", code: "VJTI", city: "Mumbai", state: "Maharashtra", plan: "STARTER", students: 290, status: "ACTIVE" },
  ];

  return (
    <AppShell role="ADMIN" title="Subscribed Colleges & Institutions">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Directory & Subscriptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of affiliated engineering institutions, assigned TPOs, and active quotas.
          </p>
        </div>

        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">College Code</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Enrolled Candidates</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.map((col) => (
                  <tr key={col.code} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{col.name}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{col.code}</td>
                    <td className="py-3.5 px-4 text-slate-600">{col.city}, {col.state}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {col.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{col.students}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {col.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
