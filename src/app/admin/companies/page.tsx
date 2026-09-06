"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Clock, HelpCircle, CheckCircle2, Edit2, X, Loader2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { COMPANIES_DATA } from "@/lib/mockData";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>(COMPANIES_DATA);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [editDuration, setEditDuration] = useState<number>(45);
  const [editNegativeMarking, setEditNegativeMarking] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/admin/companies");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCompanies(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load admin companies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const openEditModal = (comp: any) => {
    setEditingCompany(comp);
    setEditDuration(comp.blueprint?.durationMinutes || 45);
    setEditNegativeMarking(Boolean(comp.blueprint?.negativeMarking));
    setEditDescription(comp.description || "");
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleSaveBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    setIsSaving(true);
    setErrorMessage(null);

    const updatedBlueprint = {
      ...editingCompany.blueprint,
      durationMinutes: Number(editDuration),
      negativeMarking: editNegativeMarking,
    };

    try {
      const res = await fetch("/api/admin/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCompany.id,
          blueprint: updatedBlueprint,
          description: editDescription,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update blueprint");
      }

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id
            ? { ...c, blueprint: updatedBlueprint, description: editDescription }
            : c
        )
      );

      setSaveSuccess(true);
      setTimeout(() => {
        setEditingCompany(null);
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save company blueprint:", err);
      setErrorMessage(err.message || "Failed to update company");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell role="ADMIN" title="Company Blueprint Configurations">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Company Assessment Blueprints
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage section compositions, time limits, question quotas, and negative marking ratios stored in the database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div key={c.id} className="saas-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                    {c.badge || c.slug.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {c.blueprint?.durationMinutes || 45} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{c.name} Blueprint</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Section Quotas:</p>
                  {(c.blueprint?.sections || []).map((s: any) => (
                    <div key={s.name} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-semibold text-slate-800">{s.questionCount} Qs</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Negative Marking:</span>
                  <span className="font-semibold text-slate-800">
                    {c.blueprint?.negativeMarking ? "Yes (-0.25)" : "None"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(c)}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configure Blueprint</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for editing blueprint */}
        {editingCompany && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Configure {editingCompany.name} Blueprint
                </h3>
                <button
                  onClick={() => setEditingCompany(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveBlueprint} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Description</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={10}
                      max={240}
                      value={editDuration}
                      onChange={(e) => setEditDuration(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Negative Marking</label>
                    <select
                      value={editNegativeMarking ? "true" : "false"}
                      onChange={(e) => setEditNegativeMarking(e.target.value === "true")}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="false">None (0.00 penalty)</option>
                      <option value="true">Active (-0.25 penalty)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCompany(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || saveSuccess}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Blueprint</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
