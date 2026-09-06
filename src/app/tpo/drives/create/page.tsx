"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarCheck, CheckCircle2, Shield } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function CreateMockDrivePage() {
  const router = useRouter();
  const [driveName, setDriveName] = useState("");
  const [companySlug, setCompanySlug] = useState("tcs");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(45);
  const [department, setDepartment] = useState("ALL");
  const [instructions, setInstructions] = useState(
    "Mandatory pre-placement evaluation. Telemetry signals active. Complete within allocated time window."
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      router.push("/tpo/drives");
    }, 1000);
  };

  return (
    <AppShell role="TPO" title="Schedule Mock Drive">
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <Link
            href="/tpo/drives"
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Schedule New Campus Placement Drive
            </h2>
            <p className="text-xs text-slate-500">
              Configure company blueprint, assign candidate cohorts, and set assessment window.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="saas-card p-6 bg-white space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Drive Title / Identifier
            </label>
            <input
              type="text"
              required
              value={driveName}
              onChange={(e) => setDriveName(e.target.value)}
              placeholder="e.g. TCS Prime & Digital Mock Drive — Batch 2025"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company Pattern Blueprint
              </label>
              <select
                value={companySlug}
                onChange={(e) => {
                  setCompanySlug(e.target.value);
                  const selected = COMPANIES_DATA.find((c) => c.slug === e.target.value);
                  if (selected) setDuration(selected.blueprint.durationMinutes);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {COMPANIES_DATA.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} ({c.badge})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Department / Cohort
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Eligible Engineering Branches</option>
                <option value="CSE">Computer Science & Engineering only</option>
                <option value="ISE">Information Science only</option>
                <option value="ECE">Electronics & Communication only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Drive Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
              <input
                type="number"
                required
                min={15}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions for Candidates
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Real-time integrity telemetry and server-side scoring will automatically be enabled for this drive.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/tpo/drives"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaved}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Drive Scheduled!</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Confirm & Schedule Drive</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
