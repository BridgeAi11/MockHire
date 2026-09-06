"use client";

import React, { useState } from "react";
import { Download, Search, Filter, ArrowUpDown, Award, Target, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface ResultRow {
  rank: number;
  student: string;
  regNo: string;
  dept: string;
  score: number;
  readiness: number;
  integrity: "NORMAL" | "REVIEW_RECOMMENDED";
  status: "QUALIFIED" | "NEEDS_PRACTICE";
}

const RESULTS_DATA: ResultRow[] = [
  { rank: 1, student: "Ananya Iyer", regNo: "1RV21CS018", dept: "CSE", score: 92.5, readiness: 89.0, integrity: "NORMAL", status: "QUALIFIED" },
  { rank: 2, student: "Aarav Sharma", regNo: "1RV21CS042", dept: "CSE", score: 84.0, readiness: 81.0, integrity: "NORMAL", status: "QUALIFIED" },
  { rank: 3, student: "Sneha Patel", regNo: "1RV21IS090", dept: "ISE", score: 79.5, readiness: 77.0, integrity: "NORMAL", status: "QUALIFIED" },
  { rank: 4, student: "Karthik Reddy", regNo: "1RV21IS055", dept: "ISE", score: 76.0, readiness: 73.0, integrity: "NORMAL", status: "QUALIFIED" },
  { rank: 5, student: "Priya Nair", regNo: "1RV21EC082", dept: "ECE", score: 68.0, readiness: 65.0, integrity: "REVIEW_RECOMMENDED", status: "NEEDS_PRACTICE" },
  { rank: 6, student: "Vikram Das", regNo: "1RV21EE034", dept: "EEE", score: 61.5, readiness: 58.0, integrity: "NORMAL", status: "NEEDS_PRACTICE" },
  { rank: 7, student: "Rohan Kulkarni", regNo: "1RV21CS112", dept: "CSE", score: 52.0, readiness: 48.0, integrity: "REVIEW_RECOMMENDED", status: "NEEDS_PRACTICE" },
];

export default function TPOResultsPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("ALL");

  const filtered = RESULTS_DATA.filter((r) => {
    const matchSearch = r.student.toLowerCase().includes(search.toLowerCase()) || r.regNo.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "ALL" || r.dept === dept;
    return matchSearch && matchDept;
  });

  const exportCSV = () => {
    const header = "Rank,Student,RegisterNumber,Department,Score,Readiness,Integrity,Status\n";
    const rows = filtered
      .map((r) => `${r.rank},"${r.student}","${r.regNo}","${r.dept}",${r.score},${r.readiness},"${r.integrity}","${r.status}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mockhire_tpo_results_${Date.now()}.csv`;
    a.click();
  };

  return (
    <AppShell role="TPO" title="Assessment Results & Rankings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Campus Placement Mock Results
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cohort score rankings, median metrics, and decoupled readiness indices.
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Results CSV</span>
          </button>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Assessed Candidates</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">264</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Average Score</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">73.4%</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Median Score</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">76.0%</p>
          </div>
          <div className="saas-card p-4 bg-white">
            <p className="text-xs text-slate-400 font-bold uppercase">Drive Qualification</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">68.2%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 saas-card bg-white">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate by name or register number..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ISE">ISE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>

        {/* Results Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Performance Score</th>
                  <th className="py-3 px-4">Readiness Score</th>
                  <th className="py-3 px-4">Integrity Telemetry</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.rank} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">#{r.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{r.regNo}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{r.dept}</td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600">{r.score}%</td>
                    <td className="py-3.5 px-4 font-extrabold text-indigo-600">{r.readiness}%</td>
                    <td className="py-3.5 px-4">
                      {r.integrity === "NORMAL" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Normal
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Review Recommended
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "QUALIFIED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {r.status}
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
