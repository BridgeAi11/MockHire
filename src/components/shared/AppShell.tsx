"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  ClipboardList,
  BarChart3,
  TrendingUp,
  History,
  Users,
  CalendarCheck,
  Award,
  ShieldAlert,
  FileSpreadsheet,
  CreditCard,
  Layers,
  HelpCircle,
  Cpu,
  Activity,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  School,
} from "lucide-react";
import { UserRole, UserProfile } from "@/types";
import { getCurrentUser, logout, syncSupabaseSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/student/companies", icon: Building2 },
  { label: "Practice", href: "/student/practice", icon: BookOpen },
  { label: "Mock Tests", href: "/student/mock", icon: ClipboardList },
  { label: "Readiness", href: "/student/readiness", icon: Award },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "History", href: "/student/history", icon: History },
];

const TPO_NAV: NavItem[] = [
  { label: "Dashboard", href: "/tpo/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/tpo/students", icon: Users },
  { label: "Mock Drives", href: "/tpo/drives", icon: CalendarCheck },
  { label: "Results", href: "/tpo/results", icon: BarChart3 },
  { label: "Readiness", href: "/tpo/readiness", icon: Award },
  { label: "Integrity", href: "/tpo/integrity", icon: ShieldAlert },
  { label: "Reports", href: "/tpo/reports", icon: FileSpreadsheet },
  { label: "Companies", href: "/tpo/companies", icon: Building2 },
  { label: "Subscription", href: "/tpo/subscription", icon: CreditCard },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Colleges", href: "/admin/colleges", icon: School },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Questions", href: "/admin/questions", icon: Layers },
  { label: "Question Review", href: "/admin/questions/review", icon: HelpCircle, badge: "3" },
  { label: "Sessions", href: "/admin/sessions", icon: ClipboardList },
  { label: "AI Jobs", href: "/admin/ai-jobs", icon: Cpu },
  { label: "Integrity", href: "/admin/integrity", icon: ShieldAlert },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "System Health", href: "/admin/system-health", icon: Activity },
];

interface AppShellProps {
  children: React.ReactNode;
  role: UserRole;
  title?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, role, title }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function initUser() {
      let active = getCurrentUser();
      if (!active && isSupabaseConfigured) {
        active = await syncSupabaseSession();
      }
      if (!mounted) return;
      if (!active) {
        router.replace("/login");
      } else {
        setUser(active);
      }
    }
    initUser();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const navItems =
    role === "STUDENT"
      ? STUDENT_NAV
      : role === "TPO"
      ? TPO_NAV
      : ADMIN_NAV;

  const roleLabel =
    role === "STUDENT"
      ? "Student Portal"
      : role === "TPO"
      ? "College TPO Portal"
      : "Platform Admin";

  const roleBadgeColor =
    role === "STUDENT"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : role === "TPO"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-white border-r border-slate-200">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-tighter">
              MH
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">MockHire</span>
            </div>
          </Link>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
            {role}
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.fullName || "Authenticated User"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user?.collegeName || user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white flex flex-col h-full shadow-2xl z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  MH
                </div>
                <span className="font-bold text-slate-900 text-lg">MockHire</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-medium text-slate-400">{roleLabel}</span>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {title || "Overview"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Notification Drawer */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                    <span className="text-[10px] text-blue-600 font-medium">All caught up</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                      <p className="font-semibold text-blue-900">Upcoming TCS Mock Drive</p>
                      <p className="text-blue-700 mt-0.5 text-[11px]">
                        Your college scheduled the TCS NQT mock for this Saturday.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800">Curated Question Bank Update</p>
                      <p className="text-slate-600 mt-0.5 text-[11px]">
                        20 new pattern-verified questions added for Accenture Core.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user?.fullName || "User"}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
