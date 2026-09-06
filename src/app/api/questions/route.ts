import { NextResponse, NextRequest } from "next/server";
import { CURATED_QUESTIONS_BANK } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  const isAdmin = request.headers.get("x-mockhire-role") === "ADMIN";

  try {
    if (isSupabaseConfigured) {
      let query = supabase
        .from("questions")
        .select("*, companies!inner(slug)")
        .eq("status", "PUBLISHED");

      if (company) {
        query = query.eq("companies.slug", company);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const safeQuestions = data.map((q) => {
          const item = {
            id: q.id,
            companyId: q.company_id,
            companySlug: q.companies?.slug || company,
            category: q.category,
            topic: q.topic,
            subtopic: q.subtopic,
            difficulty: q.difficulty,
            questionType: q.question_type,
            questionText: q.question_text,
            codeSnippet: q.code_snippet,
            options: q.options,
            explanation: isAdmin ? q.explanation : undefined,
            correctAnswer: isAdmin ? q.correct_answer_encrypted : undefined,
            sourceType: q.source_type,
            sourceConfidence: q.source_confidence,
            status: q.status,
          };
          return item;
        });

        return NextResponse.json({
          success: true,
          data: safeQuestions,
          source: "supabase",
        });
      }
    }
  } catch (err) {
    console.warn("Supabase questions fetch fallback:", err);
  }

  // Fallback to embedded bank
  let filtered = CURATED_QUESTIONS_BANK;
  if (company) {
    filtered = filtered.filter((q) => q.companySlug === company);
  }

  const safeQuestions = filtered.map((q) => {
    if (isAdmin) return q;
    const { correctAnswer, ...rest } = q;
    return rest;
  });

  return NextResponse.json({
    success: true,
    data: safeQuestions,
    source: "fallback",
  });
}
