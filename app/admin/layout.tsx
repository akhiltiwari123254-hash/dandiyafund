"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  FileSpreadsheet,
  Settings,
  History,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If login or setup, don't show admin sidebar
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/setup";

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const data = await res.json();
        if (data.success && data.admin) {
          setAdmin(data.admin);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120510] flex items-center justify-center text-dandiya-gold text-sm font-semibold">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-dandiya-gold border-t-transparent rounded-full animate-spin" />
          <span>Verifying administrator privileges...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Payment Requests", href: "/admin/requests", icon: Receipt },
    { label: "Student Database", href: "/admin/students", icon: Users },
    { label: "Import Excel / CSV", href: "/admin/import", icon: FileSpreadsheet },
    { label: "Event Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Trail", href: "/admin/audit", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#120510] text-[#FDFBF7] flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1C0A19] border-b border-dandiya-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-dandiya-gold" />
          <span className="font-serif font-bold text-sm text-dandiya-gold-light">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-dandiya-gold hover:bg-dandiya-wine"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#180715] border-r border-dandiya-border flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-dandiya-border/50 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-dandiya-maroon border border-dandiya-gold/40 flex items-center justify-center text-dandiya-gold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-dandiya-gold-light">
                DANDIYA ADMIN
              </p>
              <p className="text-[10px] uppercase tracking-widest text-dandiya-ivory/50">
                Event Fund Control
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-dandiya-ivory/60 hover:text-dandiya-gold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Admin Identity */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-[#230C1E] border border-dandiya-border/60">
          <span className="text-[10px] uppercase tracking-wider text-dandiya-gold font-bold block">
            Active Administrator
          </span>
          <p className="font-semibold text-xs text-dandiya-ivory truncate mt-0.5">
            {admin?.name || "Event Admin"}
          </p>
          <p className="text-[11px] text-dandiya-ivory/50 font-mono">
            {admin?.phone}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-dandiya-wine text-dandiya-gold border border-dandiya-border shadow-sm"
                    : "text-dandiya-ivory/70 hover:bg-dandiya-wine/40 hover:text-dandiya-gold"
                }`}
              >
                <Icon className="w-4 h-4 text-dandiya-saffron" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-dandiya-border/50 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-dandiya-ivory/70 hover:text-dandiya-gold hover:bg-dandiya-wine/40 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
