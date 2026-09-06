import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMPANIES_DATA } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id;

  try {
    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const { data: session, error } = await adminClient
          .from("mock_sessions")
          .select("*, companies(*)")
          .eq("id", sessionId)
          .single();

        if (!error && session) {
          const company = session.companies;
          return NextResponse.json({
            success: true,
            data: {
              id: session.id,
              companyName: company?.name || "Corporate Pattern",
              companySlug: company?.slug || "general",
              completedAt: session.completed_at || session.started_at,
              totalScore: session.total_score || 0,
              performanceScore: session.performance_score || 0,
              readinessScore: session.readiness_score || 0,
              integrityScore: session.integrity_score || 100,
              questionsAnswered: session.cheat_summary_json?.questionsAnswered || 25,
              totalQuestions: session.cheat_summary_json?.totalQuestions || 25,
              correctCount: session.cheat_summary_json?.correctCount || 0,
              integrityEvents: session.cheat_summary_json || {
                tabSwitches: 0,
                windowBlurs: 0,
                copyPastes: 0,
                speedAnomalies: 0,
              },
            },
            source: "supabase",
          });
        }
      }
    }
  } catch (err) {
    console.warn("Session fetch fallback:", err);
  }

  // Fallback simulation
  return NextResponse.json({
    success: true,
    data: {
      id: sessionId,
      companyName: "TCS Pattern",
      companySlug: "tcs",
      completedAt: new Date().toISOString(),
      totalScore: 82.5,
      performanceScore: 84.0,
      readinessScore: 81.0,
      integrityScore: 96.0,
      questionsAnswered: 24,
      totalQuestions: 25,
      correctCount: 21,
      integrityEvents: { tabSwitches: 1, windowBlurs: 1, copyPastes: 0, speedAnomalies: 0 },
    },
    source: "fallback",
  });
}
