import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companySlug, driveId } = body;

    const authUser = await getAuthenticatedUser();
    const studentId = authUser?.id || body.studentId || "00000000-0000-0000-0000-000000000000";

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        // Lookup company ID by slug
        let companyId: string | undefined = undefined;
        const { data: comp } = await adminClient
          .from("companies")
          .select("id")
          .eq("slug", companySlug)
          .single();

        if (comp?.id) {
          companyId = comp.id;
        }

        const { data: session, error } = await adminClient
          .from("mock_sessions")
          .insert({
            student_id: studentId,
            company_id: companyId,
            college_id: authUser?.collegeId,
            drive_id: driveId,
            session_type: driveId ? "COLLEGE_DRIVE" : "SELF_MOCK",
            status: "IN_PROGRESS",
            started_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (!error && session) {
          return NextResponse.json({
            success: true,
            sessionId: session.id,
            source: "supabase",
          });
        }
      }
    }

    // Fallback ID when offline/unconfigured
    return NextResponse.json({
      success: true,
      sessionId: `ses-${Date.now()}`,
      source: "fallback",
    });
  } catch (err) {
    console.error("Failed to initialize session:", err);
    return NextResponse.json(
      { success: false, error: "Failed to initialize session" },
      { status: 500 }
    );
  }
}
