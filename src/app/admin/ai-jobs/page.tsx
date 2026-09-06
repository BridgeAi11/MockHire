"use client";

import React, { useState } from "react";
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface AIJobRow {
  id: string;
  jobType: string;
  sessionId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  retryCount: number;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

const SAMPLE_AI_JOBS: AIJobRow[] = [
  { id: "job-801", jobType: "DESCRIPTIVE_EVAL", sessionId: "ses-101", status: "COMPLETED", retryCount: 0, createdAt: "15 mins ago", completedAt: "14 mins ago" },
  { id: "job-802", jobType: "CODING_EXPLANATION", sessionId: "ses-102", status: "COMPLETED", retryCount: 0, createdAt: "20 mins ago", completedAt: "19 mins ago" },
  { id: "job-803", jobType: "COMMUNICATION_FEEDBACK", sessionId: "ses-103", status: "PROCESSING", retryCount: 0, createdAt: "2 mins ago" },
  { id: "job-804", jobType: "DESCRIPTIVE_EVAL", sessionId: "ses-104", status: "FAILED", retryCount: 2, createdAt: "45 mins ago", errorMessage: "NIM Gateway rate-limit timeout (HTTP 429)" },
  { id: "job-805", jobType: "SIMILARITY_CHECK", sessionId: "ses-105", status: "PENDING", retryCount: 0, createdAt: "1 min ago" },
];

export default function AdminAIJobsPage() {
  const [jobs, setJobs] = useState(SAMPLE_AI_JOBS);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = (jobId: string) => {
    setRetryingId(jobId);
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "PROCESSING", retryCount: j.retryCount + 1, errorMessage: undefined } : j))
      );
      setRetryingId(null);
    }, 1000);
  };

  return (
    <AppShell role="ADMIN" title="AI Asynchronous Job Monitor">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              NVIDIA NIM AI Worker Queues
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor asynchronous descriptive evaluation, coding explanations, and retry failed jobs.
            </p>
          </div>
          <button
            onClick={() => setJobs([...SAMPLE_AI_JOBS])}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-4 gap-4">
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Pending</p>
            <p className="text-xl font-extrabold text-slate-700 mt-1">1</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Processing</p>
            <p className="text-xl font-extrabold text-blue-600 mt-1">1</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Completed</p>
            <p className="text-xl font-extrabold text-emerald-600 mt-1">1,480</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Failed</p>
            <p className="text-xl font-extrabold text-rose-600 mt-1">1</p>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Service / Type</th>
                  <th className="py-3 px-4">Session Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Retries</th>
                  <th className="py-3 px-4">Created / Completed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{j.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{j.jobType}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{j.sessionId}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          j.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : j.status === "PROCESSING"
                            ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                            : j.status === "FAILED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {j.status}
                      </span>
                      {j.errorMessage && (
                        <p className="text-[10px] text-rose-600 mt-1 max-w-xs">{j.errorMessage}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{j.retryCount}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {j.createdAt} {j.completedAt ? `→ ${j.completedAt}` : ""}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {j.status === "FAILED" && (
                        <button
                          onClick={() => handleRetry(j.id)}
                          disabled={retryingId === j.id}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded transition flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{retryingId === j.id ? "Retrying..." : "Retry Job"}</span>
                        </button>
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
