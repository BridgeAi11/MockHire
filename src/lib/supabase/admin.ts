import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase Admin Client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to perform privileged operations (e.g. grading tests,
 * verifying questions' encrypted answers, background jobs).
 *
 * CRITICAL SECURITY:
 * Never expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser!
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Security Violation: createAdminClient called in client browser context!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder") || serviceRoleKey.includes("placeholder")) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
