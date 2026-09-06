import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
);

// Client-side Supabase client with auto-refreshing sessions and realtime websockets
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper for Real-time subscription to Mock Sessions (for student & TPO dashboards)
export function subscribeToMockSessions(
  filterColumn?: string,
  filterValue?: string,
  onPayload?: (payload: unknown) => void
) {
  if (!isSupabaseConfigured) return null;

  const channelName = `public:mock_sessions:${filterColumn || "all"}:${filterValue || "all"}`;
  const channel = supabase.channel(channelName);

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mock_sessions",
        ...(filterColumn && filterValue ? { filter: `${filterColumn}=eq.${filterValue}` } : {}),
      },
      (payload) => {
        if (onPayload) onPayload(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Helper for Real-time Proctoring / Cheat Events (Live TPO integrity monitoring)
export function subscribeToCheatEvents(
  sessionId?: string,
  onPayload?: (payload: unknown) => void
) {
  if (!isSupabaseConfigured) return null;

  const channelName = `public:cheat_events:${sessionId || "all"}`;
  const channel = supabase.channel(channelName);

  channel
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "cheat_events",
        ...(sessionId ? { filter: `session_id=eq.${sessionId}` } : {}),
      },
      (payload) => {
        if (onPayload) onPayload(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
