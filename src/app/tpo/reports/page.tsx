"use client";

import React from "react";
import { Download, FileSpreadsheet, BarChart2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

export default function TPOReportsPage() {
  const reports = [
    { title: "Consolidated Placement Mock Drive Report", desc: "Complete cohort roster, scores, accuracy, and readiness status across all branches.", size: "142 KB" },
    { title: "Company-Wise Assessment Readiness Audit", desc: "Breakdown of candidate readiness for TCS, Infosys, Accenture, Wipro, and Cognizant.", size: "88 KB" },
    { title: "Curriculum Deficiencies & Weak Areas Summary", desc: "Aggregated topic failures across Aptitude, Programming, SQL, and Verbal Communication.", size: "64 KB" },
    { title: "Proctoring Telemetry & Integrity Audit Log", desc: "Logged browser signals, tab switches, and review statuses for campus placement records.", size: "52 KB" },
  ];

  const handleDownload = (title: string) => {
    const content = `MockHire Institutional Report: ${title}\nGenerated on: ${new Date().toISOString()}\nCollege: RV College of Engineering\nStatus: Verified\n`;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`;
    a.click();
  };

  return (
    <AppShell role="TPO" title="Placement Audit Reports">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Export Placement Audit & Readiness Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Download verified assessment analytics, company readiness indexes, and proctoring summaries.
          </p>
        </div>

        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.title}
              className="saas-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rep.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg">{rep.desc}</p>
                  <span className="inline-block mt-2 text-[10px] text-slate-400 font-mono">
                    Format: CSV • Approximate Size: {rep.size}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(rep.title)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
