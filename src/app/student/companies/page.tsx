"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Building2, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { COMPANIES_DATA } from "@/lib/mockData";
import { Company } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function StudentCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(COMPANIES_DATA);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: Company[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            logoUrl: c.logo_url,
            description: c.description,
            difficulty: c.difficulty || "MEDIUM",
            isActive: c.is_active,
            sampleQuestionsCount: c.sample_questions_count || 30,
            blueprint: c.test_blueprint_json || {
              durationMinutes: 60,
              totalQuestions: 30,
              negativeMarking: false,
              sections: [],
              instructions: [],
            },
          }));
          setCompanies(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch companies from Supabase, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const filtered = companies.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.description.toLowerCase().includes(search.toLowerCase());
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
