"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { syncSupabaseSession, getRedirectPathForRole } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Finalizing authentication...");

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        const profile = await syncSupabaseSession();
        if (!mounted) return;

        if (profile) {
          setStatus("Authentication verified! Redirecting to dashboard...");
          router.replace(getRedirectPathForRole(profile.role));
        } else {
          setStatus("Redirecting to login...");
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        if (mounted) {
          router.replace("/login?error=oauth_failed");
        }
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="saas-card bg-white p-8 max-w-sm w-full text-center shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Authenticating</h3>
        <p className="text-xs text-slate-500">{status}</p>
      </div>
    </div>
  );
}
