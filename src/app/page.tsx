"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  Clock,
  Building2,
  Users,
  Layers,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  AlertTriangle,
  Award,
  Terminal,
  FileCheck2,
  Lock,
  CalendarCheck,
} from "lucide-react";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is MockHire?",
      a: "MockHire is an assessment and readiness platform specifically engineered around company-pattern test blueprints (such as TCS NQT, Infosys Specialist, Accenture Cognitive, and Wipro Elite NLTH). It enables engineering students to practice realistic assessments and helps colleges/TPOs conduct structured placement mock drives.",
    },
    {
      q: "Does MockHire generate questions with AI?",
      a: "No. In strict accordance with our product principles, MockHire does NOT generate assessment questions using AI. All questions are curated and verified by subject matter experts to match genuine company patterns. AI is utilized solely for post-submission feedback, coding explanations, and communication evaluation.",
    },
    {
      q: "How are mock assessments created?",
      a: "Every mock exam is assembled by our deterministic blueprint engine. It selects questions from our curated question bank respecting exact section distributions, topics, subtopics, difficulty ratios, and negative marking rules.",
    },
    {
      q: "How does college assessment work for TPOs?",
      a: "TPOs and placement directors can import student cohorts via CSV, schedule mock drives with customizable blueprints, monitor live student participation in real-time, view cohort score distributions, and export comprehensive audit reports.",
    },
    {
      q: "What is company readiness?",
      a: "Company readiness is an objective, multi-factor indicator calculated from a candidate's recent mock scores, section accuracy, consistency, and topic mastery against that company's specific blueprint. It is an assessment-readiness metric, not a hiring guarantee.",
    },
    {
      q: "How does integrity monitoring work?",
      a: "During an assessment, MockHire monitors client-side browser telemetry including tab switches, window blurs, rapid answering anomalies, and clipboard events. These signals generate a 'Review Recommended' flag for faculty review rather than making automated cheating accusations.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. PUBLIC NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base tracking-tighter shadow-sm">
              MH
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">MockHire</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#for-students" className="hover:text-blue-600 transition">For Students</a>
            <a href="#for-colleges" className="hover:text-blue-600 transition">For Colleges</a>
            <a href="#companies" className="hover:text-blue-600 transition">Companies</a>
            <a href="#integrity" className="hover:text-blue-600 transition">Integrity</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=register"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              How It Works
            </a>
            <a
              href="#for-students"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              For Students
            </a>
            <a
              href="#for-colleges"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              For Colleges
            </a>
            <a
              href="#companies"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Companies
            </a>
            <a
              href="#integrity"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Integrity
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              FAQ
            </a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=register"
                className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Curated Company-Pattern Placement Assessments</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Practice smarter. <br />
                Assess fairly. <br />
                <span className="text-blue-600">Get placement-ready.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Company-pattern placement assessments built for engineering students and colleges.
                Master real blueprint distributions with difficulty-calibrated question banks and AI-assisted feedback.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-500/10 inline-flex items-center gap-2"
                >
                  <span>Start Practicing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#for-colleges"
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-xs inline-flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>For Colleges & TPOs</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero AI question generation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic server-side scoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>College mock drive management</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock UI Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
                {/* Visual Assessment Runner Window Header */}
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-300 ml-2">TCS NQT Pattern Runner</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono bg-slate-800 px-2.5 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    <span>32:15</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Live Simulation Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                        Section 1 of 3: Numerical Ability
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 mt-0.5">
                        Question 4 • Medium Difficulty
                      </h4>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Answer Saved Locally
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    A retailer marks an item 40% above production cost and offers successive discounts of 15% and 10%. What is the net profit percentage?
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg border border-blue-600 bg-blue-50/70 text-xs font-medium text-blue-900 flex items-center justify-between">
                      <span>A. 7.10% Profit</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                      B. 8.40% Profit
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                      C. 9.20% Loss
                    </div>
                  </div>

                  {/* Telemetry Indicator */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>Integrity telemetry active</span>
                    </div>
                    <span className="text-emerald-700 font-semibold">Normal (Clean)</span>
                  </div>
                </div>

                {/* Bottom Snapshot Footer */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Progress: 14 / 25 Answered</span>
                  <span className="text-blue-600 font-semibold">Auto-saving to device</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4-STEP PROCESS) */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Step-by-Step Flow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Structured preparation that mirrors hiring assessment realities
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Four focused steps designed to build true test familiarity and actionable competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose a Company",
                desc: "Select target enterprise patterns like TCS, Infosys, Accenture, Wipro, or Cognizant with verified section breakdowns.",
                icon: Building2,
              },
              {
                step: "02",
                title: "Practice Relevant Topics",
                desc: "Drill topic-by-topic questions with immediate step-by-step explanations and untimed conceptual learning.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Take a Realistic Mock",
                desc: "Complete timed assessments with strict blueprint constraints, server duration checks, and local answer recovery.",
                icon: Clock,
              },
              {
                step: "04",
                title: "Improve Your Readiness",
                desc: "Inspect decoupled Performance, Readiness, and Integrity scores with AI-assisted feedback on weak topics.",
                icon: Award,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="saas-card p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-bold text-blue-600">{s.step}</span>
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STUDENT FEATURES */}
      <section id="for-students" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>For Engineering Candidates</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">
                Eliminate assessment surprises with authentic company patterns
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most students practice on generic quiz apps and freeze during actual company drives.
                MockHire prepares you with authentic question mixes, section time allocations, and difficulty balancing.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Explore student dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Company-Pattern Practice",
                  desc: "Topic-wise drills aligned strictly to specific corporate recruitment blueprints.",
                  icon: Building2,
                },
                {
                  title: "Timed Mock Assessments",
                  desc: "Full-length timed simulations with automatic submission and section navigators.",
                  icon: Clock,
                },
                {
                  title: "Hands-on Coding Sandbox",
                  desc: "Judge0-compatible execution with hidden test cases and memory/runtime metrics.",
                  icon: Terminal,
                },
                {
                  title: "Company Readiness Score",
                  desc: "Multi-factor assessment-readiness tracking across target hiring organizations.",
                  icon: Award,
                },
                {
                  title: "AI-Assisted Feedback",
                  desc: "In-depth explanations for descriptive and code solutions via NVIDIA NIM.",
                  icon: Sparkles,
                },
                {
                  title: "Local Answer Recovery",
                  desc: "Zero lost progress — your selections are safely preserved on your device.",
                  icon: Lock,
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                    <div className="p-2 w-fit rounded-lg bg-white border border-slate-200 text-blue-600 mb-3 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. COLLEGE / TPO FEATURES */}
      <section id="for-colleges" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Institutional Portal</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Empower Training & Placement Officers with actionable data
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Run college-wide placement drills, identify underperforming branches, and track candidate readiness before campus hiring begins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="saas-card p-6">
              <div className="p-2.5 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Cohort Management & CSV Import</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Bulk upload student registers by department and graduation year with automated email validation and duplicate checks.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="p-2.5 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Custom Mock Drives & Live Monitoring</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Schedule company-specific mock drives for specific batches with live proctoring telemetry and submission status grids.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="p-2.5 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">College Weak Area Heatmaps</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Pinpoint curriculum deficiencies (e.g. 54% proficiency in Advanced SQL) so faculty can organize targeted remediation workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPANIES SHOWCASE */}
      <section id="companies" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Pattern Blueprints</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                Supported Company-Pattern Tracks
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Pattern configurations modeled after national recruitment evaluation structures.
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all available blueprints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANIES_DATA.slice(0, 3).map((comp) => (
              <div key={comp.id} className="saas-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {comp.badge}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">
                      {comp.blueprint.durationMinutes} mins
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-4">{comp.name}</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{comp.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    {comp.blueprint.sections.map((sec) => (
                      <div key={sec.name} className="flex items-center justify-between text-xs text-slate-500">
                        <span>{sec.name}</span>
                        <span className="font-semibold text-slate-700">{sec.questionCount} Qs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/login"
                    className="w-full py-2 text-xs font-semibold text-center block text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    Start {comp.name} Pattern Mock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AI SECTION (TRANSPARENT VALUE PROPOSITION) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Where It Earns Its Keep</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              AI supports evaluation and feedback — it does NOT generate the assessment question bank.
            </h3>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              We reject hallucinated AI questions. Assessment questions are strictly curated and vetted from genuine company patterns.
              We leverage modern language models (via NVIDIA NIM) exclusively where they add authentic value: providing personalized, asynchronous feedback after submission.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2">Descriptive Answer Feedback</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyzes structure, technical accuracy, and completeness for workplace essay and communication questions.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2">Coding Explanations & Bug Hints</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breaks down why a candidate algorithm exceeded time complexity limits or failed edge cases without revealing answers during tests.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-sm font-bold text-white mb-2">Semantic Answer Similarity</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronously flags potential cross-candidate answer duplication for review by college placement officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTEGRITY SECTION */}
      <section id="integrity" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Fair Assessment Telemetry</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">
                Ethical integrity signals without automated accusations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                MockHire tracks browser signals to protect assessment validity, including tab switches, window blurs, rapid speed anomalies, and clipboard events.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Strict Ethical Principle:</p>
                <p>
                  Telemetry signals never automatically accuse a candidate of dishonesty. They generate clear, objective flags labelled <strong>&quot;Review Recommended&quot;</strong> for placement administrators to evaluate in context.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {[
                { title: "Tab Switches & Blur Tracking", desc: "Monitors application focus shifts without intrusive surveillance." },
                { title: "Clipboard Copy/Paste Events", desc: "Buffers clipboard interactions during active test execution." },
                { title: "Anomalous Answer Speed", desc: "Flags questions answered in under 3 seconds where complex calculations were expected." },
                { title: "Decoupled Integrity Score", desc: "Reported separately from candidate performance so merit is evaluated fairly." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex items-start gap-3">
                  <div className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRICING */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Institutional Plans</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Transparent institutional licensing for colleges
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Students prepare with free self-practice. Colleges subscribe for campus-wide mock drives and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "₹18,000",
                period: "per academic year",
                desc: "Ideal for individual engineering departments conducting pilot placement drives.",
                features: [
                  "Up to 300 registered students",
                  "3 college-wide mock drives",
                  "TCS & Infosys pattern tracks",
                  "CSV student cohort import",
                  "Basic branch analytics",
                ],
                popular: false,
              },
              {
                name: "Growth",
                price: "₹45,000",
                period: "per academic year",
                desc: "Comprehensive placement readiness for multi-department engineering colleges.",
                features: [
                  "Up to 1,200 registered students",
                  "Unlimited mock drives",
                  "All 5 enterprise company patterns",
                  "Live proctoring telemetry",
                  "Weak area curriculum heatmaps",
                  "Priority TPO support",
                ],
                popular: true,
              },
              {
                name: "Institution",
                price: "Custom",
                period: "enterprise license",
                desc: "Designed for universities and large educational trusts managing multiple campuses.",
                features: [
                  "Unlimited student enrollment",
                  "Custom college blueprint overrides",
                  "Dedicated placement manager",
                  "LMS & ERP student sync",
                  "Historical placement audit reports",
                  "Custom NDA & SLA agreements",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`saas-card p-8 flex flex-col justify-between relative ${
                  plan.popular ? "border-blue-500 ring-2 ring-blue-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                    Most Popular for TPOs
                  </span>
                )}
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500">/{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/login"
                    className={`w-full py-2.5 text-xs font-semibold text-center block rounded-lg transition ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    Select {plan.name} Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Frequently Asked Questions</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Everything you need to know about MockHire
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to prepare smarter for upcoming campus drives?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Experience realistic company-pattern assessments with deterministic scoring, resilient answer recovery, and decoupled readiness tracking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 rounded-xl transition shadow-md"
            >
              Start Practicing Now
            </Link>
            <a
              href="#for-colleges"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition border border-blue-500"
            >
              Talk to MockHire for Colleges
            </a>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                MH
              </div>
              <span className="text-lg font-bold text-white tracking-tight">MockHire</span>
            </div>
            <p className="text-slate-400 max-w-sm text-[11px] leading-relaxed">
              Company-pattern placement assessment and readiness platform for engineering candidates and colleges.
            </p>
            <p className="text-slate-500 text-[10px]">
              © {new Date().getFullYear()} MockHire Technologies. All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">Product</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#for-students" className="hover:text-white">For Students</a></li>
              <li><a href="#for-colleges" className="hover:text-white">For Colleges & TPOs</a></li>
              <li><a href="#companies" className="hover:text-white">Company Blueprints</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">Integrity</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#integrity" className="hover:text-white">Fair Telemetry</a></li>
              <li><a href="#faq" className="hover:text-white">No AI Questions</a></li>
              <li><a href="#faq" className="hover:text-white">Deterministic Scoring</a></li>
              <li><a href="#faq" className="hover:text-white">Review Signals</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">Legal & Security</h5>
            <ul className="space-y-2 text-[11px]">
              <li><span className="hover:text-white cursor-pointer">Privacy Notice</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer">Security Practices</span></li>
              <li><span className="hover:text-white cursor-pointer">Audit Logging</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
