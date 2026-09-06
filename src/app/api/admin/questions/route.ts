import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CURATED_QUESTIONS_BANK } from "@/lib/mockData";

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
          .from("questions")
          .select("*, companies(name, slug)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped = data.map((q: any) => ({
            id: q.id,
            companyId: q.company_id,
            companySlug: q.companies?.slug || "general",
            companyName: q.companies?.name || "General Pattern",
            category: q.category,
            topic: q.topic,
            subtopic: q.subtopic,
            difficulty: q.difficulty,
            questionType: q.question_type,
            questionText: q.question_text,
            options: q.options || [],
            correctAnswer: q.correct_answer_encrypted,
            explanation: q.explanation,
            codingTestCases: q.coding_test_cases,
            sourceType: q.source_type,
            sourceConfidence: Number(q.source_confidence || 0.95),
            status: q.status,
            timesUsed: q.times_used || 0,
            attemptCount: q.attempt_count || 0,
            correctCount: q.correct_count || 0,
            createdAt: q.created_at,
          }));

          return NextResponse.json({ success: true, data: mapped, source: "supabase" });
        }
      }
    }

    return NextResponse.json({ success: true, data: CURATED_QUESTIONS_BANK, source: "fallback" });
  } catch (err: any) {
    console.error("Admin questions GET error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      companySlug,
      category,
      topic,
      subtopic,
      difficulty,
      questionType = "MCQ",
      questionText,
      options,
      correctAnswer,
      explanation,
      codingTestCases,
      sourceType = "COMPANY_PATTERN",
      sourceConfidence = 0.95,
      status = "PUBLISHED",
    } = body;

    if (!questionText || !correctAnswer || !category || !topic) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: questionText, correctAnswer, category, topic" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        // Resolve company_id from companySlug
        let companyId = null;
        if (companySlug) {
          const { data: comp } = await adminClient
            .from("companies")
            .select("id")
            .eq("slug", companySlug)
            .single();
          if (comp) companyId = comp.id;
        }

        const { data: newQuestion, error } = await adminClient
          .from("questions")
          .insert({
            company_id: companyId,
            category,
            topic,
            subtopic: subtopic || null,
            difficulty,
            question_type: questionType,
            question_text: questionText,
            options: options || [],
            correct_answer_encrypted: correctAnswer,
            explanation,
            coding_test_cases: codingTestCases || null,
            source_type: sourceType,
            source_confidence: sourceConfidence,
            status,
            approved_by: authUser.id,
          })
          .select()
          .single();

        if (error) {
          console.error("Failed to insert question:", error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: newQuestion });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `mock-q-${Date.now()}`,
        companySlug,
        category,
        topic,
        questionText,
        options,
        correctAnswer,
        explanation,
        status,
      },
    });
  } catch (err: any) {
    console.error("Admin question POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to create question" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, ...rest } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Question ID required" }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const updatePayload: any = { updated_at: new Date().toISOString() };
        if (status) updatePayload.status = status;
        if (rest.questionText) updatePayload.question_text = rest.questionText;
        if (rest.correctAnswer) updatePayload.correct_answer_encrypted = rest.correctAnswer;
        if (rest.explanation) updatePayload.explanation = rest.explanation;
        if (rest.difficulty) updatePayload.difficulty = rest.difficulty;
        if (rest.category) updatePayload.category = rest.category;
        if (rest.topic) updatePayload.topic = rest.topic;
        if (rest.options) updatePayload.options = rest.options;
        if (rest.codingTestCases) updatePayload.coding_test_cases = rest.codingTestCases;

        const { data, error } = await adminClient
          .from("questions")
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

    return NextResponse.json({ success: true, data: { id, status, ...rest } });
  } catch (err: any) {
    console.error("Admin question PATCH error:", err);
    return NextResponse.json({ success: false, error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin role required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Question ID required" }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const { error } = await adminClient.from("questions").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin question DELETE error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete question" }, { status: 500 });
  }
}
