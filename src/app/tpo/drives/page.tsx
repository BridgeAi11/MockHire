"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Plus, Clock, Users, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { DEMO_MOCK_DRIVES } from "@/lib/mockData";

export default function TPODrivesPage() {
  const [drives, setDrives] = useState(DEMO_MOCK_DRIVES);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = drives.filter((d) => statusFilter === "ALL" || d.status === statusFilter);

  return (
    <AppShell role="TPO" title="Campus Mock Drives">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Placement Mock Drives</h2>
            <p className="text-xs text-slate-500 mt-1">
              Create and orchestrate company-pattern mock assessments across candidate branches.
            </p>
          </div>
          <Link
            href="/tpo/drives/create"
            className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Drive</span>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 w-fit">
          {["ALL", "LIVE", "SCHEDULED", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((drv) => (
            <div key={drv.id} className="saas-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    {drv.companyName} Pattern
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      drv.status === "LIVE"
                        ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                        : drv.status === "SCHEDULED"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {drv.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-4 leading-snug">
                  {drv.driveName}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{drv.instructions}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Scheduled:</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(drv.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-800">{drv.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Cohort:</span>
                    <span className="font-semibold text-slate-800">
                      {drv.studentsCompleted} / {drv.totalStudentsAssigned} Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                {drv.status === "LIVE" ? (
                  <Link
                    href={`/tpo/drives/${drv.id}/monitor`}
                    className="w-full py-2 text-xs font-bold text-center block text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                  >
                    Live Drive Monitor
                  </Link>
                ) : (
                  <Link
                    href={`/tpo/results`}
                    className="w-full py-2 text-xs font-semibold text-center block text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                  >
                    View Cohort Performance
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
