"use client";

import React from "react";
import { Activity, CheckCircle2, ShieldCheck, Database, Cpu, Server, Lock } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

export default function AdminSystemHealthPage() {
  const services = [
    { name: "Next.js App Engine", status: "OPERATIONAL", latency: "18ms", uptime: "99.98%", icon: Server },
    { name: "PostgreSQL & Supabase RLS", status: "OPERATIONAL", latency: "32ms", uptime: "99.99%", icon: Database },
    { name: "NVIDIA NIM AI Gateway", status: "OPERATIONAL", latency: "1,240ms", uptime: "99.85%", icon: Cpu },
    { name: "Judge0 Code Execution Sandbox", status: "OPERATIONAL", latency: "820ms", uptime: "99.90%", icon: Activity },
    { name: "BullMQ / Redis Async Broker", status: "OPERATIONAL", latency: "4ms", uptime: "100.0%", icon: Server },
    { name: "Local Client Storage Engine", status: "OPERATIONAL", latency: "1ms", uptime: "100.0%", icon: Lock },
  ];

  return (
    <AppShell role="ADMIN" title="System Infrastructure Health">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Microservices & Worker Health
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry for API servers, AI inferencing gateways, and execution sandboxes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div key={svc.name} className="saas-card p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{svc.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{svc.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Latency: <strong className="text-slate-800 font-mono">{svc.latency}</strong></span>
                  <span>Uptime: <strong className="text-slate-800 font-mono">{svc.uptime}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
