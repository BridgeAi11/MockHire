import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        // Parallel queries for all platform stats
        const [
          { count: collegesCount },
          { count: studentsCount },
          { count: companiesCount },
          { count: questionsCount },
          { count: publishedCount },
          { count: reviewCount },
          { count: draftCount },
          { count: sessionsCount },
          { count: aiJobsCount },
          { count: flagsCount },
        ] = await Promise.all([
          adminClient.from("colleges").select("*", { count: "exact", head: true }),
          adminClient.from("users").select("*", { count: "exact", head: true }).eq("role", "STUDENT"),
          adminClient.from("companies").select("*", { count: "exact", head: true }).eq("is_active", true),
          adminClient.from("questions").select("*", { count: "exact", head: true }),
          adminClient.from("questions").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
          adminClient.from("questions").select("*", { count: "exact", head: true }).eq("status", "UNDER_REVIEW"),
          adminClient.from("questions").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
          adminClient.from("mock_sessions").select("*", { count: "exact", head: true }),
          adminClient.from("ai_jobs").select("*", { count: "exact", head: true }).eq("status", "PROCESSING"),
          adminClient.from("cheat_events").select("*", { count: "exact", head: true }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            collegesCount: collegesCount || 0,
            studentsCount: studentsCount || 0,
            companiesCount: companiesCount || 0,
            questionsCount: questionsCount || 0,
            publishedQuestionsCount: publishedCount || 0,
            underReviewQuestionsCount: reviewCount || 0,
            draftQuestionsCount: draftCount || 0,
            sessionsCount: sessionsCount || 0,
            aiJobsCount: aiJobsCount || 0,
            telemetryFlagsCount: flagsCount || 0,
          },
          source: "supabase",
        });
      }
    }

    // Fallback counts
    return NextResponse.json({
      success: true,
      data: {
        collegesCount: 14,
        studentsCount: 3850,
        companiesCount: 5,
        questionsCount: 412,
        publishedQuestionsCount: 385,
        underReviewQuestionsCount: 18,
        draftQuestionsCount: 9,
        sessionsCount: 1420,
        aiJobsCount: 4,
        telemetryFlagsCount: 12,
      },
      source: "fallback",
    });
  } catch (err: any) {
    console.error("Admin stats fetch error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
