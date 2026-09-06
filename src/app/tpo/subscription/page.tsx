"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

export default function TPOSubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("GROWTH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCheckout = (planName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(`Order created & verified via Razorpay sandbox for ${planName} Plan!`);
    }, 1200);
  };

  return (
    <AppShell role="TPO" title="College Institutional Subscription">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Placement Licensing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your college subscription, active student quotas, and campus drive privileges.
          </p>
        </div>

        {/* Current Active Subscription Status */}
        <div className="saas-card p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE INSTITUTIONAL LICENSE
            </span>
            <h3 className="text-2xl font-black tracking-tight">Growth Plan — Academic Year 2024–25</h3>
            <p className="text-xs text-blue-200 max-w-xl">
              RV College of Engineering • Valid through June 30, 2025 • Up to 1,200 active candidates
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-200">Enrolled Students</span>
            <p className="text-2xl font-extrabold text-white">892 / 1,200</p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            {
              name: "Starter",
              price: "₹18,000",
              period: "per year",
              students: "Up to 300 students",
              features: ["3 Campus Mock Drives", "TCS & Infosys Tracks", "CSV Roster Upload", "Standard Analytics"],
            },
            {
              name: "Growth",
              price: "₹45,000",
              period: "per year",
              students: "Up to 1,200 students",
              features: ["Unlimited Campus Drives", "All 5 Enterprise Tracks", "Live Proctoring Telemetry", "Weak Area Heatmaps", "Priority TPO Support"],
              isCurrent: true,
            },
            {
              name: "Institution",
              price: "Custom",
              period: "enterprise license",
              students: "Unlimited students",
              features: ["Multi-Campus Trust Support", "Custom Blueprint Overrides", "ERP & LMS Integration", "Dedicated Placement Advisor"],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`saas-card p-6 bg-white flex flex-col justify-between ${
                plan.isCurrent ? "border-blue-600 ring-2 ring-blue-600/20" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                  {plan.isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Current Plan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.students}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <ul className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  disabled={plan.isCurrent || isProcessing}
                  onClick={() => handleCheckout(plan.name)}
                  className={`w-full py-2 text-xs font-bold rounded-lg transition ${
                    plan.isCurrent
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                  }`}
                >
                  {plan.isCurrent ? "Active Plan" : isProcessing ? "Connecting to Gateway..." : `Renew / Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
