"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Users,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface StudentMonitorRow {
  id: string;
  name: string;
  regNo: string;
  department: string;
  status: "IN_PROGRESS" | "SUBMITTED" | "NOT_STARTED";
  progress: string;
  timeRemaining: string;
  integrityFlags: number;
}

const LIVE_CANDIDATES: StudentMonitorRow[] = [
  { id: "c1", name: "Aarav Sharma", regNo: "1RV21CS042", department: "CSE", status: "IN_PROGRESS", progress: "19 / 25 Qs", timeRemaining: "12m 40s", integrityFlags: 0 },
  { id: "c2", name: "Ananya Iyer", regNo: "1RV21CS018", department: "CSE", status: "SUBMITTED", progress: "25 / 25 Qs", timeRemaining: "0m 00s", integrityFlags: 0 },
  { id: "c3", name: "Karthik Reddy", regNo: "1RV21IS055", department: "ISE", status: "IN_PROGRESS", progress: "14 / 25 Qs", timeRemaining: "18m 10s", integrityFlags: 1 },
  { id: "c4", name: "Priya Nair", regNo: "1RV21EC082", department: "ECE", status: "IN_PROGRESS", progress: "16 / 25 Qs", timeRemaining: "15m 30s", integrityFlags: 3 },
  { id: "c5", name: "Rohan Kulkarni", regNo: "1RV21CS112", department: "CSE", status: "NOT_STARTED", progress: "0 / 25 Qs", timeRemaining: "45m 00s", integrityFlags: 0 },
  { id: "c6", name: "Sneha Patel", regNo: "1RV21IS090", department: "ISE", status: "SUBMITTED", progress: "24 / 25 Qs", timeRemaining: "0m 00s", integrityFlags: 0 },
  { id: "c7", name: "Vikram Das", regNo: "1RV21EE034", department: "EEE", status: "IN_PROGRESS", progress: "11 / 25 Qs", timeRemaining: "22m 15s", integrityFlags: 0 },
];

export default function LiveDriveMonitorPage() {
  const params = useParams();
  const [candidates, setCandidates] = useState(LIVE_CANDIDATES);
  const [filter, setFilter] = useState("ALL");

  const inProgressCount = candidates.filter((c) => c.status === "IN_PROGRESS").length;
  const submittedCount = candidates.filter((c) => c.status === "SUBMITTED").length;
  const notStartedCount = candidates.filter((c) => c.status === "NOT_STARTED").length;
  const flaggedCount = candidates.filter((c) => c.integrityFlags > 1).length;

  const filtered = candidates.filter((c) => {
    if (filter === "FLAGGED") return c.integrityFlags > 1;
    if (filter === "ALL") return true;
    return c.status === filter;
  });

  return (
    <AppShell role="TPO" title="Live Drive Proctoring Monitor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/tpo/drives"
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Accenture Advanced Cognitive Mock Session
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                  ● LIVE SESSION
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time cohort telemetry, question progression, and integrity signal review.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCandidates([...LIVE_CANDIDATES])}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* 4 Summary Stat Cards (Section 32) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="saas-card p-4 bg-white border-l-4 border-l-blue-600">
            <p className="text-xs text-slate-400 font-bold uppercase">Total Enrolled</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{candidates.length}</p>
          </div>
          <div className="saas-card p-4 bg-white border-l-4 border-l-amber-500">
            <p className="text-xs text-slate-400 font-bold uppercase">In Progress</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{inProgressCount}</p>
          </div>
          <div className="saas-card p-4 bg-white border-l-4 border-l-emerald-600">
            <p className="text-xs text-slate-400 font-bold uppercase">Submitted</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{submittedCount}</p>
          </div>
          <div className="saas-card p-4 bg-white border-l-4 border-l-rose-500">
            <p className="text-xs text-slate-400 font-bold uppercase">Integrity Flagged</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{flaggedCount}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          {["ALL", "IN_PROGRESS", "SUBMITTED", "NOT_STARTED", "FLAGGED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === f ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Candidates Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Test Progress</th>
                  <th className="py-3 px-4">Time Left</th>
                  <th className="py-3 px-4">Integrity Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.regNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{c.department}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === "SUBMITTED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : c.status === "IN_PROGRESS"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{c.progress}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.timeRemaining}</td>
                    <td className="py-3 px-4">
                      {c.integrityFlags === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Normal (Clean)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Review Recommended ({c.integrityFlags})</span>
                        </span>
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
