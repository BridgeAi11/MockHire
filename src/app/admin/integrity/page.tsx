"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Check, X } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface PlatformIntegrityRow {
  id: string;
  student: string;
  college: string;
  signalType: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
  status: "PENDING" | "REVIEWED" | "DISMISSED";
  notes: string;
}

const SAMPLE_PLATFORM_FLAGS: PlatformIntegrityRow[] = [
  { id: "pi-1", student: "Rohan Kulkarni", college: "RV College of Engg", signalType: "UNUSUAL_SPEED", severity: "HIGH", timestamp: "25 mins ago", status: "PENDING", notes: "Consecutive complex math solved < 2.5s" },
  { id: "pi-2", student: "Priya Nair", college: "RV College of Engg", signalType: "TAB_SWITCH", severity: "MEDIUM", timestamp: "35 mins ago", status: "PENDING", notes: "3 tab switches detected during active exam" },
  { id: "pi-3", student: "Siddharth Sen", college: "BMS College of Engg", signalType: "SIMILARITY_FLAG", severity: "MEDIUM", timestamp: "2 hours ago", status: "REVIEWED", notes: "89% semantic overlap in descriptive answer" },
];

export default function AdminIntegrityPage() {
  const [flags, setFlags] = useState(SAMPLE_PLATFORM_FLAGS);

  const handleAction = (id: string, newStatus: "REVIEWED" | "DISMISSED") => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)));
  };

  return (
    <AppShell role="ADMIN" title="Platform Integrity Review">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Platform-Wide Integrity Signals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit telemetry flags from across all subscribed institutions.
          </p>
        </div>

        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Signal Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Audit Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flags.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{f.student}</td>
                    <td className="py-3.5 px-4 text-slate-600">{f.college}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{f.signalType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.severity === "HIGH"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs">{f.notes}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === "REVIEWED"
                            ? "bg-emerald-50 text-emerald-700"
                            : f.status === "DISMISSED"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {f.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAction(f.id, "REVIEWED")}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleAction(f.id, "DISMISSED")}
                            className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded"
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
