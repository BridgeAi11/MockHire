"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight, ShieldCheck, Target, Award } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { DEMO_STUDENT_SESSIONS } from "@/lib/mockData";

export default function StudentHistoryPage() {
  return (
    <AppShell role="STUDENT" title="Assessment History">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Completed Mock Assessments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review detailed scores, section accuracy breakdowns, and integrity signals for all past attempts.
          </p>
        </div>

        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Company Pattern</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date Completed</th>
                  <th className="py-3.5 px-4">Performance</th>
                  <th className="py-3.5 px-4">Readiness</th>
                  <th className="py-3.5 px-4">Integrity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEMO_STUDENT_SESSIONS.map((ses) => (
                  <tr key={ses.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {ses.companyName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {ses.sessionType === "SELF_MOCK" ? "Self Practice" : "College Drive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ses.completedAt || ses.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600">
                      {ses.performanceScore}%
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-indigo-600">
                      {ses.readinessScore}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/student/mock/${ses.companySlug}/result?sessionId=${ses.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        <span>Analysis</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
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
