import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Company } from "@/types";
import { getReadinessTier } from "@/lib/utils";

interface CompanyCardProps {
  company: Company;
  readinessScore?: number;
  onTakeMock?: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  readinessScore = 75,
  onTakeMock,
}) => {
  const readinessTier = getReadinessTier(readinessScore);

  return (
    <div className="saas-card p-6 flex flex-col justify-between hover:border-blue-300 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-lg text-blue-700 shadow-xs">
              {company.name.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-lg leading-tight">{company.name}</h4>
              <span className="inline-block mt-0.5 text-xs font-medium text-slate-500">
                {company.badge || "Pattern Blueprint"}
              </span>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${readinessTier.badgeClass}`}
          >
            {readinessScore}% Ready
          </span>
        </div>

        <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        {/* Blueprint Overview */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.blueprint.durationMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.blueprint.totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Curated Company-Pattern Blueprint</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/student/practice?company=${company.slug}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
        >
          Practice Topics
        </Link>
        {onTakeMock ? (
          <button
            onClick={() => onTakeMock(company)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs inline-flex items-center justify-center gap-1"
          >
            Take Mock <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <Link
            href={`/student/mock/${company.slug}`}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs inline-flex items-center justify-center gap-1 text-center"
          >
            Take Mock <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
