"use client";

import React, { useState, Suspense } from "react";
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
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { CURATED_QUESTIONS_BANK, COMPANIES_DATA } from "@/lib/mockData";
import { Question } from "@/types";

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get("company") || "ALL";

  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  // Filter questions
  const filteredQuestions = CURATED_QUESTIONS_BANK.filter((q) => {
    const matchComp = selectedCompany === "ALL" || q.companySlug === selectedCompany;
    const matchCat = selectedCategory === "ALL" || q.category === selectedCategory;
    return matchComp && matchCat;
  });

  const currentQ: Question | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (showExplanation || !currentQ) return;
    setSelectedOption(optId);
  };

  const handleVerify = () => {
    if (!selectedOption || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctAnswer;
    setUserAttempts((prev) => ({
      ...prev,
      [currentQ.id]: { selected: selectedOption, isCorrect },
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextQ = filteredQuestions[currentIndex + 1];
      const prevAttempt = userAttempts[nextQ.id];
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
      const prevAttempt = userAttempts[prevQ.id];
      if (prevAttempt) {
        setSelectedOption(prevAttempt.selected);
        setShowExplanation(true);
      } else {
        setSelectedOption(null);
        setShowExplanation(false);
      }
    }
  };

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
                  setShowExplanation(false);
                  setSelectedOption(null);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Companies</option>
                {COMPANIES_DATA.map((c) => (
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
                  setShowExplanation(false);
                  setSelectedOption(null);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Categories</option>
                <option value="Numerical Ability">Numerical Ability</option>
                <option value="Verbal & Reasoning">Verbal & Reasoning</option>
                <option value="Reasoning Ability">Reasoning Ability</option>
                <option value="Technical Pseudo-code">Technical Pseudo-code</option>
                <option value="Technical Core">Technical Core</option>
                <option value="SQL & Data Engineering">SQL & Data Engineering</option>
                <option value="Hands-on Coding">Hands-on Coding</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">
              Question <strong className="text-slate-800">{currentIndex + 1}</strong> of{" "}
              <strong className="text-slate-800">{filteredQuestions.length}</strong>
            </span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
              Untimed Practice
            </span>
          </div>
        </div>

        {/* Active Question Card */}
        {currentQ ? (
          <div className="saas-card p-6 sm:p-8 bg-white space-y-6">
            {/* Question meta */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-500">• {currentQ.topic}</span>
                {currentQ.subtopic && (
                  <span className="text-xs text-slate-400">({currentQ.subtopic})</span>
                )}
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            {/* Question text */}
            <div className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
              {currentQ.questionText}
            </div>

            {/* Code Snippet if applicable */}
            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Options */}
            {currentQ.options && (
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isAnswer = currentQ.correctAnswer === opt.id;
                  let optStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";

                  if (showExplanation) {
                    if (isAnswer) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                    } else if (isSelected && !isAnswer) {
                      optStyle = "border-rose-500 bg-rose-50 text-rose-900";
                    }
                  } else if (isSelected) {
                    optStyle = "border-blue-600 bg-blue-50 text-blue-900 font-semibold";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={showExplanation}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {showExplanation && isAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {showExplanation && isSelected && !isAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation Drawer */}
            {showExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Curated Solution & Detailed Explanation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Source: {currentQ.sourceType} • Verification Confidence: {Math.round(currentQ.sourceConfidence * 100)}%
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {!showExplanation ? (
                <button
                  onClick={handleVerify}
                  disabled={!selectedOption}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 transition shadow-xs"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 transition shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="saas-card p-12 text-center">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No practice questions match this filter</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function StudentPracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading practice...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
