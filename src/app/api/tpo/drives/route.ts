import { NextResponse, NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_MOCK_DRIVES } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || (authUser.role !== "TPO" && authUser.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        let query = adminClient
          .from("mock_drives")
          .select("*, companies(name, slug)")
          .order("scheduled_at", { ascending: false });

        if (authUser.collegeId) {
          query = query.eq("college_id", authUser.collegeId);
        }

        const { data, error } = await query;

        if (!error && data) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            collegeId: d.college_id,
            collegeName: authUser.fullName || "College of Engineering",
            tpoId: d.tpo_id,
            companyId: d.company_id,
            companyName: d.companies?.name || "Corporate Partner",
            driveName: d.drive_name,
            scheduledAt: d.scheduled_at,
            durationMinutes: d.duration_minutes,
            status: d.status,
            instructions: d.instructions,
            totalStudentsAssigned: 120,
            studentsCompleted: 95,
            averageScore: 74.2,
            averageReadiness: 72.0,
          }));

          return NextResponse.json({ success: true, data: mapped, source: "supabase" });
        }
      }
    }

    return NextResponse.json({ success: true, data: DEMO_MOCK_DRIVES, source: "fallback" });
  } catch (err) {
    console.error("TPO drives fetch error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser || (authUser.role !== "TPO" && authUser.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      driveName,
      companySlug,
      scheduledAt,
      durationMinutes = 60,
      instructions = "",
      department = "ALL",
    } = body;

    if (!driveName || !companySlug) {
      return NextResponse.json(
        { success: false, error: "driveName and companySlug are required" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const adminClient = createAdminClient();
      if (adminClient) {
        // 1. Get company id from slug
        const { data: comp } = await adminClient
          .from("companies")
          .select("id, name")
          .eq("slug", companySlug)
          .single();

        if (!comp) {
          return NextResponse.json({ success: false, error: "Company blueprint not found" }, { status: 404 });
        }

        // 2. Insert into mock_drives
        const { data: insertedDrive, error: driveErr } = await adminClient
          .from("mock_drives")
          .insert({
            college_id: authUser.collegeId || "00000000-0000-0000-0000-000000000000",
            tpo_id: authUser.id,
            company_id: comp.id,
            drive_name: driveName,
            scheduled_at: scheduledAt || new Date().toISOString(),
            duration_minutes: durationMinutes,
            status: "SCHEDULED",
            instructions,
          })
          .select()
          .single();

        if (driveErr) {
          console.error("Failed to insert mock drive:", driveErr);
          return NextResponse.json({ success: false, error: driveErr.message }, { status: 500 });
        }

        // 3. Find registered students in college to assign to drive
        let studentQuery = adminClient
          .from("users")
          .select("id")
          .eq("role", "STUDENT");

        if (authUser.collegeId) {
          studentQuery = studentQuery.eq("college_id", authUser.collegeId);
        }

        if (department !== "ALL") {
          studentQuery = studentQuery.eq("department", department);
        }

        const { data: students } = await studentQuery;

        let assignedCount = 0;
        if (students && students.length > 0) {
          const assignments = students.map((s: any) => ({
            drive_id: insertedDrive.id,
            student_id: s.id,
            status: "INVITED",
          }));

          await adminClient.from("mock_drive_students").insert(assignments);
          assignedCount = assignments.length;
        }

        return NextResponse.json({
          success: true,
          data: {
            ...insertedDrive,
            companyName: comp.name,
            totalStudentsAssigned: assignedCount,
          },
        });
      }
    }

    // Fallback simulation if offline
    return NextResponse.json({
      success: true,
      data: {
        id: `drv-${Date.now()}`,
        driveName,
        companyName: companySlug.toUpperCase(),
        scheduledAt: scheduledAt || new Date().toISOString(),
        durationMinutes,
        status: "SCHEDULED",
        instructions,
        totalStudentsAssigned: 45,
      },
    });
  } catch (err) {
    console.error("TPO create drive error:", err);
    return NextResponse.json({ success: false, error: "Failed to schedule drive" }, { status: 500 });
  }
}
