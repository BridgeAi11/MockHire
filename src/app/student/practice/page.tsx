"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Sparkles,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { CURATED_QUESTIONS_BANK, COMPANIES_DATA } from "@/lib/mockData";
import { Question, Company } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get("company") || "ALL";

  const [companies, setCompanies] = useState<Company[]>(COMPANIES_DATA);
  const [questions, setQuestions] = useState<Question[]>(CURATED_QUESTIONS_BANK);
  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userAttempts, setUserAttempts] = useState<
    Record<string, { selected: string; isCorrect: boolean; explanation?: string; correctAnswerId?: string }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Load companies and published questions from Supabase
  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch active companies
        const { data: dbComps } = await supabase
          .from("companies")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (dbComps && dbComps.length > 0) {
          const mapped: Company[] = dbComps.map((c: any) => ({
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

        // Fetch published questions via secure API (shielded: no correct answers sent)
        const res = await fetch("/api/questions");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setQuestions(json.data);
        }
      } catch (err) {
        console.warn("Failed to load practice data from Supabase, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchComp = selectedCompany === "ALL" || q.companySlug === selectedCompany;
    const matchCat = selectedCategory === "ALL" || q.category === selectedCategory;
    return matchComp && matchCat;
  });

  const currentQ: Question | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (showExplanation || !currentQ) return;
    setSelectedOption(optId);
  };

  const handleVerify = async () => {
    if (!selectedOption || !currentQ || isVerifying) return;
    setIsVerifying(true);

    try {
      // Server-side verification (never leaks answers before student attempts)
      const res = await fetch("/api/questions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedOptionId: selectedOption,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setUserAttempts((prev) => ({
          ...prev,
          [currentQ.id]: {
            selected: selectedOption,
            isCorrect: json.data.isCorrect,
            explanation: json.data.explanation,
            correctAnswerId: json.data.correctAnswerId,
          },
        }));
        setShowExplanation(true);
      } else {
        // Fallback local verification if offline
        const isCorrect = selectedOption === currentQ.correctAnswer;
        setUserAttempts((prev) => ({
          ...prev,
          [currentQ.id]: {
            selected: selectedOption,
            isCorrect,
            explanation: currentQ.explanation,
          },
        }));
        setShowExplanation(true);
      }
    } catch {
      const isCorrect = selectedOption === currentQ.correctAnswer;
      setUserAttempts((prev) => ({
        ...prev,
        [currentQ.id]: {
          selected: selectedOption,
          isCorrect,
          explanation: currentQ.explanation,
        },
      }));
      setShowExplanation(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextQ = filteredQuestions[currentIndex + 1];
      const prevAttempt = userAttempts[nextQ?.id];
      if (prevAttempt) {
        setSelectedOption(prevAttempt.selected);
        setShowExplanation(true);
      } else {
        setSelectedOption(null);
        setShowExplanation(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      const prevQ = filteredQuestions[currentIndex - 1];
      const prevAttempt = userAttempts[prevQ?.id];
      if (prevAttempt) {
        setSelectedOption(prevAttempt.selected);
        setShowExplanation(true);
      } else {
        setSelectedOption(null);
        setShowExplanation(false);
      }
    }
  };

  const currentAttempt = currentQ ? userAttempts[currentQ.id] : undefined;

  return (
    <AppShell role="STUDENT" title="Practice Mode">
      <div className="space-y-6">
        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 saas-card bg-white">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Company Pattern
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="ALL">All Companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="ALL">All Categories</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Programming">Programming</option>
                <option value="Technical">Technical</option>
                <option value="Communication">Communication</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600">
            Question {filteredQuestions.length > 0 ? currentIndex + 1 : 0} of {filteredQuestions.length}
          </div>
        </div>

        {/* Question & Practice View */}
        {filteredQuestions.length === 0 ? (
          <div className="saas-card p-12 text-center bg-white">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No published questions match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try choosing another company or category from the filters above.
            </p>
          </div>
        ) : (
          <div className="saas-card p-6 md:p-8 bg-white space-y-6">
            {/* Meta badges */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQ?.category}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600">
                  {currentQ?.topic}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    currentQ?.difficulty === "HARD"
                      ? "bg-rose-50 text-rose-700"
                      : currentQ?.difficulty === "MEDIUM"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {currentQ?.difficulty}
                </span>
              </div>

              {currentAttempt && (
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {currentAttempt.isCorrect ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Question statement */}
            <div className="text-sm font-medium text-slate-900 leading-relaxed">
              {currentQ?.questionText}
            </div>

            {/* Code Snippet if applicable */}
            {currentQ?.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}

            {/* MCQ Options */}
            {currentQ?.options && (
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let borderClass = "border-slate-200 hover:border-slate-300";
                  let bgClass = "bg-white";

                  if (showExplanation && currentAttempt) {
                    if (currentAttempt.correctAnswerId === opt.id) {
                      borderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                      bgClass = "bg-emerald-50/50";
                    } else if (isSelected && !currentAttempt.isCorrect) {
                      borderClass = "border-rose-500 ring-2 ring-rose-500/20";
                      bgClass = "bg-rose-50/50";
                    }
                  } else if (isSelected) {
                    borderClass = "border-blue-600 ring-2 ring-blue-500/20";
                    bgClass = "bg-blue-50/40";
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={showExplanation}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${borderClass} ${bgClass}`}
                    >
                      <span className="font-medium text-slate-800">{opt.text}</span>
                      {isSelected && !showExplanation && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation box */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Answer Explanation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentAttempt?.explanation || currentQ?.explanation || "Server evaluated answer verified."}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {!showExplanation ? (
                  <button
                    onClick={handleVerify}
                    disabled={!selectedOption || isVerifying}
                    className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-xs flex items-center gap-1.5"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify Answer</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredQuestions.length - 1}
                    className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-30 transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function StudentPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading practice mode...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
