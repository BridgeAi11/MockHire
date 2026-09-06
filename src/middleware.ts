import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user, role, isConfigured } = await updateSession(request);

  // -------------------------------------------------------------
  // 1. SUPABASE REALTIME & AUTH CONFIGURED (PRODUCTION MODE)
  // -------------------------------------------------------------
  if (isConfigured) {
    const isAuthenticated = Boolean(user);

    // If already logged in and visiting /login, redirect to role dashboard
    if (pathname === "/login") {
      if (isAuthenticated && role) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else if (role === "TPO") {
          return NextResponse.redirect(new URL("/tpo/dashboard", request.url));
        } else {
          return NextResponse.redirect(new URL("/student/dashboard", request.url));
        }
      }
      return response;
    }

    // Protected paths check: /student, /tpo, /admin
    const isStudentRoute = pathname.startsWith("/student");
    const isTpoRoute = pathname.startsWith("/tpo");
    const isAdminRoute = pathname.startsWith("/admin");

    if (isStudentRoute || isTpoRoute || isAdminRoute) {
      if (!isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Enforce strict server-verified role-based access control
      if (isAdminRoute && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url));
      }

      if (isTpoRoute && role !== "TPO" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url));
      }

      if (isStudentRoute && role === "TPO") {
        // TPOs accessing student view are redirected to their TPO portal
        return NextResponse.redirect(new URL("/tpo/dashboard", request.url));
      }
    }

    return response;
  }

  // -------------------------------------------------------------
  // 2. DEMO / LOCAL FALLBACK MODE (WHEN SUPABASE KEYS NOT CONFIGURED)
  // -------------------------------------------------------------
  const demoRoleCookie = request.cookies.get("mockhire_role")?.value;

  if (pathname.startsWith("/student") || pathname.startsWith("/tpo") || pathname.startsWith("/admin")) {
    if (!demoRoleCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && demoRoleCookie !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/tpo") && demoRoleCookie !== "TPO" && demoRoleCookie !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/tpo/:path*",
    "/admin/:path*",
    "/login",
  ],
};
