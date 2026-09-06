"use client";

import React, { useState } from "react";
import { Search, Filter, Building2, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function StudentCompaniesPage() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  const filtered = COMPANIES_DATA.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) || comp.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === "ALL" || comp.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <AppShell role="STUDENT" title="Company Blueprints">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Curated Company Placement Patterns
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select an enterprise recruitment pattern to practice individual sections or take a full timed mock.
            </p>
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-56 pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy Pattern</option>
              <option value="MEDIUM">Medium Pattern</option>
              <option value="HARD">Hard Pattern</option>
            </select>
          </div>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              readinessScore={company.averageReadinessScore || 75}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
