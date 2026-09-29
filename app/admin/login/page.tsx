"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Phone, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requiresSetup) {
          setError("This admin account requires initial setup. Redirecting...");
          setTimeout(() => router.push("/admin/setup"), 1500);
        } else {
          setError(data.message || "Invalid phone number or password.");
        }
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Network authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#120510]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#1C0A19]/95 border border-dandiya-border shadow-gold-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dandiya-maroon via-dandiya-crimson to-dandiya-wine flex items-center justify-center border border-dandiya-gold/40 shadow-gold mx-auto text-dandiya-gold">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-dandiya-gold-light">
            Administrator Portal
          </h1>
          <p className="text-xs text-dandiya-ivory/60">
            Sign in to verify student transactions & manage event funds.
          </p>
        </div>

        {/* Authorized Admins Card Note */}
        <div className="p-3.5 rounded-xl bg-[#140612] border border-dandiya-border/60 text-xs text-dandiya-ivory/70 space-y-1">
          <div className="flex items-center gap-1.5 text-dandiya-gold font-semibold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron" />
            <span>Authorized College Administrators</span>
          </div>
          <div className="flex justify-between text-[11px] pt-1">
            <span>• Aaditya Gupta  </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>• Akhil Tiwari</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
              Admin Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9123456789"
                className="w-full pl-10 pr-4 py-3 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/30 focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold text-sm font-medium"
              />
              <Phone className="w-4 h-4 text-dandiya-gold/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/30 focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold text-sm"
              />
              <Lock className="w-4 h-4 text-dandiya-gold/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 shadow-gold"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* First Time Setup Link */}
        <div className="pt-2 border-t border-dandiya-border/40 text-center text-xs">
          <span className="text-dandiya-ivory/50">First time setup</span>
          <Link
            href="/admin/setup"
            className="text-dandiya-gold font-semibold hover:underline"
          >
            !
          </Link>
        </div>
      </div>
    </div>
  );
}
