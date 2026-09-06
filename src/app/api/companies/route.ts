import { NextResponse } from "next/server";
import { COMPANIES_DATA } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database row to Company structure if needed
        const mappedCompanies = data.map((c) => ({
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

        return NextResponse.json({
          success: true,
          data: mappedCompanies,
          source: "supabase",
        });
      }
    }
  } catch (err) {
    console.warn("Supabase companies fetch fallback:", err);
  }

  // Fallback to embedded company data
  return NextResponse.json({
    success: true,
    data: COMPANIES_DATA,
    source: "fallback",
  });
}
