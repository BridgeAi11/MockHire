"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  Check,
  X,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface IntegrityFlagRow {
  id: string;
  student: string;
  regNo: string;
  driveName: string;
  signalType: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
  eventDetails: string;
  reviewStatus: "PENDING" | "REVIEWED" | "DISMISSED";
}

const SAMPLE_FLAGS: IntegrityFlagRow[] = [
  {
    id: "flg-01",
    student: "Priya Nair",
    regNo: "1RV21EC082",
    driveName: "Accenture Cognitive Mock",
    signalType: "TAB_SWITCH",
    severity: "MEDIUM",
    timestamp: "10 mins ago",
    eventDetails: "Candidate switched browser tabs 3 times during Numerical Section.",
    reviewStatus: "PENDING",
  },
  {
    id: "flg-02",
    student: "Rohan Kulkarni",
    regNo: "1RV21CS112",
    driveName: "TCS Digital Pre-Mock",
    signalType: "UNUSUAL_SPEED",
    severity: "HIGH",
    timestamp: "25 mins ago",
    eventDetails: "3 consecutive complex questions answered in under 2.5 seconds each.",
    reviewStatus: "PENDING",
  },
  {
    id: "flg-03",
    student: "Karthik Reddy",
    regNo: "1RV21IS055",
    driveName: "Infosys Specialist Drill",
    signalType: "WINDOW_BLUR",
    severity: "LOW",
    timestamp: "1 hour ago",
    eventDetails: "Browser focus lost for 4 seconds during instructions phase.",
    reviewStatus: "REVIEWED",
  },
];

export default function TPOIntegrityPage() {
  const [flags, setFlags] = useState(SAMPLE_FLAGS);

  const handleUpdateStatus = (id: string, newStatus: "REVIEWED" | "DISMISSED") => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, reviewStatus: newStatus } : f))
    );
  };

  return (
    <AppShell role="TPO" title="Assessment Integrity Signals">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Fair Telemetry & Integrity Signals
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browser telemetry review signals. Designed for faculty audit without making automated accusations.
          </p>
        </div>

        {/* Ethical disclaimer reminder banner (Section 35) */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Reviewer Principle:</p>
            <p className="text-blue-800 leading-relaxed">
              Integrity telemetry records browser focus anomalies, rapid response patterns, or clipboard events as objective signals. These are <strong>never proof of dishonesty</strong> and must always be evaluated in context by human placement officers.
            </p>
          </div>
        </div>

        {/* Signal Flags Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Flagged Assessment Signals</h3>
            <span className="text-xs text-slate-500">{flags.filter((f) => f.reviewStatus === "PENDING").length} Pending Review</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Signal Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Assessment Drive</th>
                  <th className="py-3 px-4">Event Telemetry Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flags.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {f.student}
                      <p className="text-[10px] font-mono text-slate-400 font-normal">{f.regNo}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {f.signalType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.severity === "HIGH"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : f.severity === "MEDIUM"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{f.driveName}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{f.eventDetails}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.reviewStatus === "REVIEWED"
                            ? "bg-emerald-50 text-emerald-700"
                            : f.reviewStatus === "DISMISSED"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {f.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {f.reviewStatus === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(f.id, "REVIEWED")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(f.id, "DISMISSED")}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
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
