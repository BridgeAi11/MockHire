import { NextResponse, NextRequest } from "next/server";
import { CURATED_QUESTIONS_BANK } from "@/lib/mockData";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { questionId, selectedOptionId } = await request.json();

    if (!questionId || !selectedOptionId) {
      return NextResponse.json(
        { success: false, error: "questionId and selectedOptionId are required" },
        { status: 400 }
      );
    }

    // Try Supabase first if configured
    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        const { data: q, error } = await adminClient
          .from("questions")
          .select("id, correct_answer_encrypted, explanation")
          .eq("id", questionId)
          .single();

        if (!error && q) {
          const isCorrect = q.correct_answer_encrypted === selectedOptionId;
          return NextResponse.json({
            success: true,
            data: {
              isCorrect,
              correctAnswerId: q.correct_answer_encrypted,
              explanation: q.explanation || "No explanation provided.",
            },
          });
        }
      }
    }

    // Fallback to local mock bank
    const mockQ = CURATED_QUESTIONS_BANK.find((q) => q.id === questionId);
    if (mockQ) {
      const isCorrect = mockQ.correctAnswer === selectedOptionId;
      return NextResponse.json({
        success: true,
        data: {
          isCorrect,
          correctAnswerId: mockQ.correctAnswer,
          explanation: mockQ.explanation || "No explanation provided.",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Answer verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
