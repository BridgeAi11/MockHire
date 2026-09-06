"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, CalendarCheck, Clock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";
import { Company } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function TPOCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(COMPANIES_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
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
        console.warn("Failed to load TPO companies from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanies();
  }, []);

  return (
    <AppShell role="TPO" title="Company Placement Blueprints">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Enterprise Assessment Blueprints
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review syllabus distributions, time limits, and test structures before scheduling campus drives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div key={c.id} className="saas-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                    {c.badge || `${c.difficulty} Pattern`}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.blueprint.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{c.name} Assessment Track</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {c.blueprint.sections?.map((sec) => (
                    <div key={sec.name} className="flex justify-between">
                      <span>{sec.name}</span>
                      <span className="font-semibold text-slate-800">{sec.questionCount} Questions</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/tpo/drives/create`}
                  className="w-full py-2 text-xs font-bold text-center block text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
                  Schedule {c.name} Mock Drive
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
