// ============================================================
// MOCKHIRE AUTHENTICATION & ROLE ENGINE
// Supports Real Supabase Auth (Google OAuth, Email/Password) & Demo Fallback
// ============================================================

import { UserProfile, UserRole } from "@/types";
import { DEMO_USERS } from "./mockData";
import { supabase, isSupabaseConfigured } from "./supabase";

const AUTH_STORAGE_KEY = "mockhire_auth_session";
const AUTH_COOKIE_NAME = "mockhire_role";

export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard";
    case "TPO":
      return "/tpo/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;

  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Set cookie for middleware/server hints
    document.cookie = `${AUTH_COOKIE_NAME}=${user.role}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

// ------------------------------------------------------------
// REAL SUPABASE AUTH: GOOGLE OAUTH
// ------------------------------------------------------------
export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.url && typeof window !== "undefined") {
    window.location.href = data.url;
  }
}

// ------------------------------------------------------------
// REAL SUPABASE AUTH: SIGN IN WITH EMAIL & PASSWORD
// ------------------------------------------------------------
export async function signInWithSupabaseEmailPassword(
  email: string,
  password: string
): Promise<UserProfile> {
  if (!isSupabaseConfigured) {
    // Fall back to demo login if Supabase credentials are not populated
    return loginWithEmail(email);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;
  if (!authUser) {
    throw new Error("Authentication failed: No user returned");
  }

  // Fetch or upsert profile in public.users table
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", authUser.email)
    .single();

  const role: UserRole = (dbUser?.role as UserRole) || (authUser.user_metadata?.role as UserRole) || "STUDENT";
  const fullName: string =
    dbUser?.full_name ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    authUser.email?.split("@")[0] ||
    "User";

  const profile: UserProfile = {
    id: authUser.id,
    email: authUser.email || email,
    fullName,
    role,
    collegeId: dbUser?.college_id,
    department: dbUser?.department || "Engineering",
    createdAt: authUser.created_at,
    avatarUrl: authUser.user_metadata?.avatar_url || dbUser?.avatar_url,
  };

  setCurrentUser(profile);
  return profile;
}

// ------------------------------------------------------------
// REAL SUPABASE AUTH: SIGN UP (ALWAYS DEFAULTS TO STUDENT ROLE)
// ------------------------------------------------------------
export async function signUpWithSupabase(
  email: string,
  password: string,
  fullName: string
): Promise<UserProfile> {
  // SECURITY REQUIREMENT 2: Role is unconditionally STUDENT on new signup.
  // Role elevation to TPO or ADMIN must be performed by an authenticated administrator.
  const assignedRole: UserRole = "STUDENT";

  if (!isSupabaseConfigured) {
    // Fall back to demo registration if Supabase is offline
    const fallbackProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: fullName || email.split("@")[0],
      role: assignedRole,
      department: "Engineering",
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(fallbackProfile);
    return fallbackProfile;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;
  if (!authUser) {
    throw new Error("Signup failed: Could not create user");
  }

  // Insert profile in public.users table as STUDENT
  await supabase.from("users").upsert({
    id: authUser.id,
    auth_user_id: authUser.id,
    email,
    full_name: fullName,
    role: assignedRole,
  });

  const profile: UserProfile = {
    id: authUser.id,
    email,
    fullName,
    role: assignedRole,
    department: "Engineering",
    createdAt: authUser.created_at,
  };

  setCurrentUser(profile);
  return profile;
}

// ------------------------------------------------------------
// SYNC CURRENT SUPABASE SESSION (FOR OAUTH CALLBACK & APP SHELL)
// ------------------------------------------------------------
export async function syncSupabaseSession(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return getCurrentUser();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return getCurrentUser();
  }

  const user = session.user;
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const role: UserRole = (dbUser?.role as UserRole) || (user.user_metadata?.role as UserRole) || "STUDENT";
  const fullName: string =
    dbUser?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const profile: UserProfile = {
    id: user.id,
    email: user.email || "",
    fullName,
    role,
    collegeId: dbUser?.college_id,
    department: dbUser?.department || "Engineering",
    createdAt: user.created_at,
    avatarUrl: user.user_metadata?.avatar_url || dbUser?.avatar_url,
  };

  setCurrentUser(profile);
  return profile;
}

// ------------------------------------------------------------
// DEMO & CONVENIENCE METHODS
// ------------------------------------------------------------
export async function loginWithDemo(role: UserRole): Promise<UserProfile> {
  const userKey = role.toLowerCase() as keyof typeof DEMO_USERS;
  const profile = DEMO_USERS[userKey];
  if (!profile) {
    throw new Error(`Demo profile for role ${role} not found`);
  }
  setCurrentUser(profile);
  return profile;
}

export async function loginWithEmail(email: string): Promise<UserProfile> {
  const found = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    setCurrentUser(found);
    return found;
  }

  const newProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    email,
    fullName: email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Candidate",
    role: "STUDENT",
    collegeName: "Registered University",
    department: "Engineering",
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(newProfile);
  return newProfile;
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore network errors on signout
    }
  }

  setCurrentUser(null);

  if (typeof window !== "undefined") {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("mockhire_") || key.startsWith("assessment_"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}
