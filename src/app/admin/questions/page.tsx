"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { CURATED_QUESTIONS_BANK } from "@/lib/mockData";
import { Question } from "@/types";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(CURATED_QUESTIONS_BANK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filtered = questions.filter((q) => {
    const matchSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase()) ||
      (q.companySlug || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || q.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || q.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleUpdateStatus = (id: string, newStatus: Question["status"]) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  return (
    <AppShell role="ADMIN" title="Curated Question Bank">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Curated Question Bank Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage enterprise pattern question pools. Zero AI-generated production questions allowed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/questions/import"
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import CSV</span>
            </Link>
            <Link
              href="/admin/questions/create"
              className="px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 saas-card bg-white">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, keyword, company..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DRAFT">Draft</option>
              <option value="RETIRED">Retired</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Numerical Ability">Numerical Ability</option>
              <option value="Verbal & Reasoning">Verbal & Reasoning</option>
              <option value="Hands-on Coding">Hands-on Coding</option>
              <option value="Technical Pseudo-code">Technical Pseudo-code</option>
              <option value="Technical Core">Technical Core</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="SQL & Data Engineering">SQL & Data Engineering</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="saas-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Question Text</th>
                  <th className="py-3 px-4">Company Pattern</th>
                  <th className="py-3 px-4">Category / Topic</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Usage Stats</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-900">
                      {q.questionText}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700 uppercase text-[11px]">
                      {q.companySlug}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{q.category}</p>
                      <p className="text-[10px] text-slate-400">{q.topic}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {q.questionType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {q.timesUsed} mocks ({q.attemptCount ? Math.round((q.correctCount! / q.attemptCount) * 100) : 75}% acc)
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : q.status === "UNDER_REVIEW"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {q.status !== "PUBLISHED" ? (
                        <button
                          onClick={() => handleUpdateStatus(q.id, "PUBLISHED")}
                          className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(q.id, "RETIRED")}
                          className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded"
                        >
                          Retire
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
