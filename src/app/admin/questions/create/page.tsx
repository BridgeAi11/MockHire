"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function CreateQuestionPage() {
  const router = useRouter();
  const [companySlug, setCompanySlug] = useState("tcs");
  const [category, setCategory] = useState("Numerical Ability");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionType, setQuestionType] = useState("MCQ");
  const [questionText, setQuestionText] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("opt-1");
  const [explanation, setExplanation] = useState("");
  const [sourceType, setSourceType] = useState("COMPANY_PATTERN");
  const [sourceConfidence, setSourceConfidence] = useState(0.95);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      router.push("/admin/questions");
    }, 1000);
  };

  return (
    <AppShell role="ADMIN" title="Add Curated Question">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <Link
            href="/admin/questions"
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Create Curated Assessment Question
            </h2>
            <p className="text-xs text-slate-500">
              Questions must be human-verified. Correct answers remain strictly server-side.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="saas-card p-6 bg-white space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Pattern</label>
              <select
                value={companySlug}
                onChange={(e) => setCompanySlug(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {COMPANIES_DATA.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} Pattern
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Numerical Ability"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Work & Time"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtopic (Optional)</label>
              <input
                type="text"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="e.g. Pipes & Cisterns"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Question Content / Problem Statement</label>
            <textarea
              rows={4}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the full question description..."
              className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Options */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Options & Server-Side Correct Answer</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="Option text A"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="Option text B"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Option text C"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  placeholder="Option text D"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correct Answer Key (Encrypted Server-Side)
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-48 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-bold text-blue-700"
              >
                <option value="opt-1">Option A</option>
                <option value="opt-2">Option B</option>
                <option value="opt-3">Option C</option>
                <option value="opt-4">Option D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Step-by-Step Solution</label>
            <textarea
              rows={3}
              required
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Step-by-step mathematical derivation or programmatic proof..."
              className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Type</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="COMPANY_PATTERN">COMPANY_PATTERN</option>
                <option value="SME">SME (Subject Matter Expert)</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="VERIFIED_REFERENCE">VERIFIED_REFERENCE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Confidence Ratio</label>
              <input
                type="number"
                step="0.01"
                min="0.50"
                max="1.00"
                value={sourceConfidence}
                onChange={(e) => setSourceConfidence(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              The correct answer key will be encrypted and will never be serialized into client test payloads.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/questions"
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
                  <span>Question Published!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Question Bank</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
