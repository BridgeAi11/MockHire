import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UserRole } from "@/types";

export function createClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  collegeId?: string;
}

/**
 * Server-side verified role lookup.
 * Validates the JWT with Supabase Auth server (NEVER trusts client headers or spoofable cookies)
 * and queries the database users table.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    return null;
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Lookup user in public.users table using verified auth user id
    const { data: dbUser } = await supabase
      .from("users")
      .select("id, email, full_name, role, college_id")
      .or(`id.eq.${user.id},auth_user_id.eq.${user.id}`)
      .single();

    const role: UserRole =
      (dbUser?.role as UserRole) ||
      (user.user_metadata?.role as UserRole) ||
      "STUDENT";

    const fullName =
      dbUser?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    return {
      id: dbUser?.id || user.id,
      email: user.email || "",
      role,
      fullName,
      collegeId: dbUser?.college_id,
    };
  } catch (err) {
    console.error("Server getAuthenticatedUser error:", err);
    return null;
  }
}
