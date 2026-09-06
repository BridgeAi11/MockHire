"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  User,
  School,
  ShieldAlert,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getCurrentUser,
  loginWithDemo,
  signInWithGoogle,
  signInWithSupabaseEmailPassword,
  signUpWithSupabase,
  getRedirectPathForRole,
} from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { UserRole } from "@/types";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "oauth_failed") {
      setErrorMessage("Google authentication was cancelled or encountered an error. Please try again.");
    }
  }, [searchParams]);

  // Check if already authenticated; if so, redirect directly to role dashboard
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing) {
      router.replace(getRedirectPathForRole(existing.role));
    }
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      await signInWithGoogle();
      // Browser will redirect to Google OAuth flow
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to initiate Google authentication");
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const profile = await loginWithDemo(role);
      router.replace(getRedirectPathForRole(profile.role));
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Failed to authenticate demo account");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter an email address");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter a password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      let profile;
      if (activeTab === "login") {
        profile = await signInWithSupabaseEmailPassword(email, password);
      } else {
        // Enforce STUDENT role server-side on registration
        profile = await signUpWithSupabase(email, password, fullName);
      }
      router.replace(getRedirectPathForRole(profile.role));
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Authentication failed. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-sm">
            MH
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">MockHire</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {activeTab === "login" ? "Sign in to your account" : "Create candidate profile"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Company-pattern assessments & campus placement readiness
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="saas-card p-6 sm:p-8 bg-white">
          {/* Tab switch */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 text-center pb-2 text-xs font-bold transition border-b-2 ${
                activeTab === "login"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 text-center pb-2 text-xs font-bold transition border-b-2 ${
                activeTab === "register"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              Register Candidate
            </button>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="mb-6 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                Instant 1-Click Evaluation
              </p>
              <span className="text-[10px] text-blue-600 font-medium">Demo Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("STUDENT")}
                className="p-2 rounded-lg bg-white border border-blue-200 text-left hover:border-blue-500 transition shadow-xs group"
              >
                <div className="flex items-center justify-between text-blue-700">
                  <User className="w-3.5 h-3.5" />
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">Student</p>
                <p className="text-[10px] text-slate-500">Practice & Mocks</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("TPO")}
                className="p-2 rounded-lg bg-white border border-blue-200 text-left hover:border-blue-500 transition shadow-xs group"
              >
                <div className="flex items-center justify-between text-indigo-700">
                  <School className="w-3.5 h-3.5" />
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">College TPO</p>
                <p className="text-[10px] text-slate-500">Drives & Cohorts</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("ADMIN")}
                className="p-2 rounded-lg bg-white border border-blue-200 text-left hover:border-blue-500 transition shadow-xs group"
              >
                <div className="flex items-center justify-between text-purple-700">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">Admin</p>
                <p className="text-[10px] text-slate-500">Question Banks</p>
              </button>
            </div>
          </div>

          {/* Real Google OAuth Button */}
          <div className="mb-5">
            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 transition shadow-xs flex items-center justify-center"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600 mr-2" />
              ) : (
                <GoogleIcon />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">Or use email</span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  Candidates register with <strong>Student Access</strong>. College TPO and Administrator roles require authorization from an existing institutional admin.
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {activeTab === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{activeTab === "login" ? "Signing in..." : "Creating account..."}</span>
                </>
              ) : (
                <>
                  <span>{activeTab === "login" ? "Sign In to MockHire" : "Create Account"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              By accessing MockHire, you agree to our{" "}
              <span className="text-slate-700 underline cursor-pointer">Terms of Assessment</span> and{" "}
              <span className="text-slate-700 underline cursor-pointer">Privacy Notice</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
