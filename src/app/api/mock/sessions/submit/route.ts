import { NextResponse, NextRequest } from "next/server";
import { CURATED_QUESTIONS_BANK, COMPANIES_DATA } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companySlug,
      answers,
      timeSpentSeconds,
      integrityEvents,
      studentId,
      collegeId,
      driveId,
    } = body;

    const company = COMPANIES_DATA.find((c) => c.slug === companySlug) || COMPANIES_DATA[0];
    const questions = CURATED_QUESTIONS_BANK.filter((q) => q.companySlug === companySlug);
    const pool = questions.length > 0 ? questions : CURATED_QUESTIONS_BANK;

    // Server-side deterministic score calculation
    let correctCount = 0;
    pool.forEach((q) => {
      const studentAnswer = answers[q.id];
      if (studentAnswer && studentAnswer === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = pool.length;
    const performanceScore = Math.round((correctCount / totalQuestions) * 100);
    const readinessScore = Math.min(100, Math.round(performanceScore * 0.95 + 4));

    // Telemetry integrity calculation
    const totalFlags =
      (integrityEvents?.tabSwitches || 0) * 2 +
      (integrityEvents?.windowBlurs || 0) +
      (integrityEvents?.copyPastes || 0) * 2 +
      (integrityEvents?.speedAnomalies || 0);

    const integrityScore = Math.max(40, 100 - totalFlags * 4);
    const sessionId = `ses-${Date.now()}`;

    // Real-time Supabase Database insertion
    if (isSupabaseConfigured) {
      try {
        // 1. Insert session record to Supabase (broadcasts to Realtime subscribers)
        const { data: insertedSession, error: sessionErr } = await supabase
          .from("mock_sessions")
          .insert({
            student_id: studentId || "00000000-0000-0000-0000-000000000000",
            company_id: company.id.length === 36 ? company.id : undefined,
            college_id: collegeId,
            drive_id: driveId,
            session_type: driveId ? "COLLEGE_DRIVE" : "SELF_MOCK",
            status: "SUBMITTED",
            total_score: performanceScore,
            performance_score: performanceScore,
            readiness_score: readinessScore,
            integrity_score: integrityScore,
            cheat_summary_json: integrityEvents || {},
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (sessionErr) {
          console.warn("Supabase session insert note:", sessionErr.message);
        }

        // 2. Insert cheat events telemetry if flags were detected
        if (integrityEvents && totalFlags > 0) {
          const eventsToInsert = [];
          if (integrityEvents.tabSwitches > 0) {
            eventsToInsert.push({
              session_id: insertedSession?.id,
              student_id: studentId || "00000000-0000-0000-0000-000000000000",
              event_type: "TAB_SWITCH",
              event_data_json: { count: integrityEvents.tabSwitches },
              severity: integrityEvents.tabSwitches > 2 ? "HIGH" : "MEDIUM",
            });
          }
          if (integrityEvents.windowBlurs > 0) {
            eventsToInsert.push({
              session_id: insertedSession?.id,
              student_id: studentId || "00000000-0000-0000-0000-000000000000",
              event_type: "WINDOW_BLUR",
              event_data_json: { count: integrityEvents.windowBlurs },
              severity: "LOW",
            });
          }
          if (integrityEvents.copyPastes > 0) {
            eventsToInsert.push({
              session_id: insertedSession?.id,
              student_id: studentId || "00000000-0000-0000-0000-000000000000",
              event_type: "PASTE",
              event_data_json: { count: integrityEvents.copyPastes },
              severity: "HIGH",
            });
          }

          if (eventsToInsert.length > 0 && insertedSession?.id) {
            await supabase.from("cheat_events").insert(eventsToInsert);
          }
        }
      } catch (dbErr) {
        console.warn("Real-time DB write note (non-blocking):", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        companyName: company.name,
        companySlug: company.slug,
        completedAt: new Date().toISOString(),
        totalScore: performanceScore,
        performanceScore,
        readinessScore,
        integrityScore,
        questionsAnswered: Object.keys(answers || {}).length,
        totalQuestions,
        correctCount,
        integrityEvents,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SUBMISSION_FAILED",
          message: "Failed to evaluate assessment submission",
        },
      },
      { status: 500 }
    );
  }
}
