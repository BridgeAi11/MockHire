import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMPANIES_DATA } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from("companies")
          .select("*, questions(count)")
          .order("created_at", { ascending: true });

        if (!error && data) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            logoUrl: c.logo_url,
            badge: c.slug.toUpperCase(),
            description: c.description,
            difficulty: c.difficulty || "MEDIUM",
            blueprint: c.test_blueprint_json || {
              durationMinutes: 45,
              sections: [],
              negativeMarking: false,
            },
            sampleQuestionsCount: c.questions?.[0]?.count || c.sample_questions_count || 0,
            isActive: c.is_active,
          }));

          return NextResponse.json({ success: true, data: mapped, source: "supabase" });
        }
      }
    }

    return NextResponse.json({ success: true, data: COMPANIES_DATA, source: "fallback" });
  } catch (err: any) {
    console.error("Admin companies GET error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, blueprint, description, difficulty, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const updatePayload: any = { updated_at: new Date().toISOString() };
        if (blueprint) updatePayload.test_blueprint_json = blueprint;
        if (description) updatePayload.description = description;
        if (difficulty) updatePayload.difficulty = difficulty;
        if (typeof isActive === "boolean") updatePayload.is_active = isActive;

        const { data, error } = await adminClient
          .from("companies")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({ success: true, data: { id, blueprint, description } });
  } catch (err: any) {
    console.error("Admin companies PATCH error:", err);
    return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 500 });
  }
}
