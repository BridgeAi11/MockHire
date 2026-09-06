"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  regNo: string;
  department: string;
  batch: string;
  latestScore: number;
  readiness: number;
  integrityFlags: number;
  status: "READY" | "NEEDS_PRACTICE" | "AT_RISK";
}

const SAMPLE_STUDENTS: StudentRow[] = [
  { id: "s1", name: "Aarav Sharma", email: "aarav.sharma@rvce.edu", regNo: "1RV21CS042", department: "CSE", batch: "2025", latestScore: 84, readiness: 81, integrityFlags: 0, status: "READY" },
  { id: "s2", name: "Ananya Iyer", email: "ananya.iyer@rvce.edu", regNo: "1RV21CS018", department: "CSE", batch: "2025", latestScore: 89, readiness: 86, integrityFlags: 1, status: "READY" },
  { id: "s3", name: "Karthik Reddy", email: "karthik.r@rvce.edu", regNo: "1RV21IS055", department: "ISE", batch: "2025", latestScore: 76, readiness: 73, integrityFlags: 0, status: "READY" },
  { id: "s4", name: "Priya Nair", email: "priya.n@rvce.edu", regNo: "1RV21EC082", department: "ECE", batch: "2025", latestScore: 68, readiness: 65, integrityFlags: 2, status: "NEEDS_PRACTICE" },
  { id: "s5", name: "Rohan Kulkarni", email: "rohan.k@rvce.edu", regNo: "1RV21CS112", department: "CSE", batch: "2025", latestScore: 52, readiness: 48, integrityFlags: 3, status: "AT_RISK" },
  { id: "s6", name: "Sneha Patel", email: "sneha.p@rvce.edu", regNo: "1RV21IS090", department: "ISE", batch: "2025", latestScore: 79, readiness: 77, integrityFlags: 0, status: "READY" },
  { id: "s7", name: "Vikram Das", email: "vikram.d@rvce.edu", regNo: "1RV21EE034", department: "EEE", batch: "2025", latestScore: 61, readiness: 58, integrityFlags: 1, status: "NEEDS_PRACTICE" },
];

export default function TPOStudentsPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = SAMPLE_STUDENTS.filter((st) => {
    const matchSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      st.regNo.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "ALL" || st.department === deptFilter;
    const matchStatus = statusFilter === "ALL" || st.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const exportCSV = () => {
    const header = "Name,Email,RegisterNumber,Department,Batch,Score,Readiness,IntegrityFlags,Status\n";
    const rows = filtered
      .map((s) => `"${s.name}","${s.email}","${s.regNo}","${s.department}","${s.batch}",${s.latestScore},${s.readiness},${s.integrityFlags},"${s.status}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mockhire_students_${Date.now()}.csv`;
    a.click();
  };

  return (
    <AppShell role="TPO" title="Student Directory">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Registered Students</h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage candidate cohorts, monitor individual mock scores, and review integrity telemetry.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/tpo/students/import"
              className="px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import Cohort CSV</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 saas-card bg-white">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, register number..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="READY">Drive Ready</option>
              <option value="NEEDS_PRACTICE">Needs Practice</option>
              <option value="AT_RISK">At Risk</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Register No.</th>
                  <th className="py-3.5 px-4">Dept / Batch</th>
                  <th className="py-3.5 px-4">Latest Mock</th>
                  <th className="py-3.5 px-4">Readiness</th>
                  <th className="py-3.5 px-4">Integrity Signals</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{st.name}</p>
                      <p className="text-[11px] text-slate-400">{st.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{st.regNo}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{st.department}</span>{" "}
                      <span className="text-slate-400">({st.batch})</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600">{st.latestScore}%</td>
                    <td className="py-3.5 px-4 font-extrabold text-indigo-600">{st.readiness}%</td>
                    <td className="py-3.5 px-4">
                      {st.integrityFlags === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Clean</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{st.integrityFlags} Flag(s)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          st.status === "READY"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : st.status === "NEEDS_PRACTICE"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {st.status.replace("_", " ")}
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
