"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Phone, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [selectedPhone, setSelectedPhone] = useState("8651879192");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters for security.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: selectedPhone,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to configure administrator password.");
      } else {
        setSuccess(data.message || "Password successfully configured! Redirecting to Dashboard...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      }
    } catch {
      setError("Network communication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#120510]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#1C0A19]/95 border border-dandiya-border shadow-gold-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dandiya-maroon via-dandiya-crimson to-dandiya-wine flex items-center justify-center border border-dandiya-gold/40 shadow-gold mx-auto text-dandiya-gold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-dandiya-gold-light">
            Secure Admin Setup
          </h1>
          <p className="text-xs text-dandiya-ivory/60 leading-relaxed">
            Configure your private password securely. Passwords are saved only as cryptographically salted hashes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-2">
              Select Administrator Account
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  selectedPhone === "8651879192"
                    ? "bg-dandiya-wine border-dandiya-gold text-dandiya-gold font-bold shadow-sm"
                    : "bg-[#140612] border-dandiya-border text-dandiya-ivory/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-dandiya-saffron" />
                  <span>Aaditya Gupta (86518 79192)</span>
                </div>
                <input
                  type="radio"
                  name="adminSelection"
                  value="8651879192"
                  checked={selectedPhone === "8651879192"}
                  onChange={() => setSelectedPhone("8651879192")}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  selectedPhone === "9142150166"
                    ? "bg-dandiya-wine border-dandiya-gold text-dandiya-gold font-bold shadow-sm"
                    : "bg-[#140612] border-dandiya-border text-dandiya-ivory/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-dandiya-saffron" />
                  <span>Akhil Tiwari (9142150166)</span>
                </div>
                <input
                  type="radio"
                  name="adminSelection"
                  value="9142150166"
                  checked={selectedPhone === "9142150166"}
                  onChange={() => setSelectedPhone("9142150166")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
              New Password (min 8 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full pl-10 pr-4 py-3 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/30 focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold text-sm"
              />
              <Lock className="w-4 h-4 text-dandiya-gold/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
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
              <span>Saving credentials...</span>
            ) : (
              <>
                <span>Save Password & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-dandiya-border/40 text-center text-xs">
          <Link
            href="/admin/login"
            className="text-dandiya-gold hover:underline"
          >
            Already set? Return to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
