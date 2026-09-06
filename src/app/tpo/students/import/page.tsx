"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";

interface ImportSummary {
  totalRows: number;
  successful: number;
  failed: number;
  duplicates: number;
  errors: string[];
}

export default function StudentImportPage() {
  const [csvContent, setCsvContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const sampleCsv = `Name,Email,Department,Batch,RegisterNumber
Aditya Varma,aditya.v@rvce.edu,CSE,2025,1RV21CS005
Bhavana Sharma,bhavana.s@rvce.edu,ISE,2025,1RV21IS023
Chirag Patel,chirag.p@rvce.edu,ECE,2025,1RV21EC041
Divya Krishnan,divya.k@rvce.edu,CSE,2025,1RV21CS038
Eshwar Rao,eshwar.r@rvce.edu,EEE,2025,1RV21EE019`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mockhire_student_import_template.csv";
    a.click();
  };

  const handleProcessImport = () => {
    if (!csvContent.trim()) return;
    setIsProcessing(true);

    const lines = csvContent.trim().split("\n").filter(Boolean);
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const seenEmails = new Set<string>();
    let successful = 0;
    let failed = 0;
    let duplicates = 0;
    const errors: string[] = [];

    // Process data rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      if (row.length < 5) {
        failed++;
        errors.push(`Row ${i + 1}: Incomplete fields (found ${row.length} columns, expected 5).`);
        continue;
      }

      const [name, email, department, batch, regNo] = row;

      if (!name || !email || !department || !batch || !regNo) {
        failed++;
        errors.push(`Row ${i + 1}: Missing mandatory values.`);
        continue;
      }

      if (!email.includes("@") || !email.includes(".")) {
        failed++;
        errors.push(`Row ${i + 1}: Invalid email address format '${email}'.`);
        continue;
      }

      if (seenEmails.has(email.toLowerCase())) {
        duplicates++;
        errors.push(`Row ${i + 1}: Duplicate email '${email}' in import file.`);
        continue;
      }

      seenEmails.add(email.toLowerCase());
      successful++;
    }

    setSummary({
      totalRows: lines.length - 1,
      successful,
      failed,
      duplicates,
      errors,
    });
    setIsProcessing(false);
  };

  return (
    <AppShell role="TPO" title="Import Candidate Cohort">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/tpo/students"
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Bulk Student CSV Upload
              </h2>
              <p className="text-xs text-slate-500">
                Register candidate rosters into the college placement directory.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadSample}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Upload & Paste Area */}
        <div className="saas-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              Paste CSV Content or Paste Roster Data
            </label>
            <button
              onClick={() => setCsvContent(sampleCsv)}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Load Demo Template
            </button>
          </div>

          <textarea
            rows={8}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Name,Email,Department,Batch,RegisterNumber&#10;Aditya Varma,aditya.v@rvce.edu,CSE,2025,1RV21CS005..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-500">
              Columns required: <strong>Name, Email, Department, Batch, RegisterNumber</strong>
            </p>
            <button
              onClick={handleProcessImport}
              disabled={isProcessing || !csvContent.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Validate & Import Roster</span>
            </button>
          </div>
        </div>

        {/* Validation Summary Report (Section 30) */}
        {summary && (
          <div className="saas-card p-6 bg-white space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Import Validation Summary</h3>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Rows</p>
                <p className="text-lg font-extrabold text-slate-900 mt-1">{summary.totalRows}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Successful</p>
                <p className="text-lg font-extrabold text-emerald-700 mt-1">{summary.successful}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] text-amber-600 font-bold uppercase">Duplicates</p>
                <p className="text-lg font-extrabold text-amber-700 mt-1">{summary.duplicates}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-[10px] text-rose-600 font-bold uppercase">Failed</p>
                <p className="text-lg font-extrabold text-rose-700 mt-1">{summary.failed}</p>
              </div>
            </div>

            {summary.errors.length > 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Row Validation Logs</span>
                </h4>
                <ul className="space-y-1 text-xs font-mono text-slate-600 max-h-40 overflow-y-auto">
                  {summary.errors.map((err, i) => (
                    <li key={i} className="text-rose-600">
                      • {err}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All rows parsed cleanly with zero duplicate or format errors.</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Link
                href="/tpo/students"
                className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Go to Student Directory
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
