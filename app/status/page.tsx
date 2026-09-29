"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface StatusResult {
  requestId: string;
  studentName: string;
  rollNo: string;
  registrationNo: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  maskedUtr: string;
  rejectionReason: string | null;
  submittedAt: string;
  verifiedAt: string | null;
}

export default function StatusPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StatusResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) {
      setError("Please enter a valid Registration Number, Roll Number, or Request ID.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`/api/status/search?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to retrieve status");
      } else {
        setResults(data.results);
      }
    } catch {
      setError("Network error while searching status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120510] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron" />
            <span>Payment Verification Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron">
            Check Payment Status
          </h1>
          <p className="mt-2 text-sm text-dandiya-ivory/70 max-w-lg mx-auto">
            Search with your Registration Number, Roll Number, or Request ID to check the real-time status of your contribution.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="statusSearchInput" className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-2">
                Registration No. / Roll No. / Request ID
              </label>
              <div className="relative">
                <input
                  id="statusSearchInput"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 202400103 or DN-10001"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/30 focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold text-sm font-medium"
                />
                <Search className="w-5 h-5 text-dandiya-gold/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 shadow-gold"
            >
              {loading ? (
                <span>Checking records...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results List */}
        {hasSearched && (
          <div className="space-y-4">
            {results.length === 0 && !loading && !error && (
              <div className="p-8 rounded-2xl bg-[#170614] border border-dandiya-border/50 text-center space-y-3">
                <p className="text-sm font-semibold text-dandiya-gold-light">
                  No payment requests found matching &quot;{query}&quot;
                </p>
                <p className="text-xs text-dandiya-ivory/60 max-w-md mx-auto">
                  If you recently submitted a contribution, please verify that you typed your exact Registration or Roll Number correctly.
                </p>
                <Link
                  href="/contribute"
                  className="inline-flex items-center gap-1.5 text-xs text-dandiya-gold font-bold hover:underline pt-2"
                >
                  <span>Submit a new payment request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {results.map((item) => {
              const isApproved = item.status === "APPROVED";
              const isPending = item.status === "PENDING";
              const isRejected = item.status === "REJECTED";

              return (
                <div
                  key={item.requestId}
                  className="p-6 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold space-y-4 transition-all hover:border-dandiya-gold/60"
                >
                  {/* Top Bar: Request ID & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dandiya-border/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm sm:text-base text-dandiya-gold-light">
                        {item.requestId}
                      </span>
                      <span className="text-xs text-dandiya-ivory/40">•</span>
                      <span className="text-xs text-dandiya-ivory/60">
                        {new Date(item.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>APPROVED</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 text-amber-300 font-bold text-xs uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>PENDING VERIFICATION</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/50 text-red-400 font-bold text-xs uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>REJECTED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student & Payment Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-dandiya-ivory/50 block">Student</span>
                      <strong className="text-dandiya-ivory text-sm">{item.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-dandiya-ivory/50 block">Roll / Reg</span>
                      <strong className="text-dandiya-gold-light">{item.rollNo}</strong>
                    </div>
                    <div>
                      <span className="text-dandiya-ivory/50 block">Amount</span>
                      <strong className="text-dandiya-gold text-base">{formatINR(item.amount)}</strong>
                    </div>
                    <div>
                      <span className="text-dandiya-ivory/50 block">UTR Reference</span>
                      <strong className="font-mono text-dandiya-ivory/80">{item.maskedUtr}</strong>
                    </div>
                  </div>

                  {/* Status Explanation / Reason */}
                  {isApproved && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        Verified & Approved. This contribution is part of the official Dandiya Night 2026 fund!
                      </span>
                    </div>
                  )}

                  {isPending && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>
                        Awaiting administrative cross-check against college bank account records.
                      </span>
                    </div>
                  )}

                  {isRejected && (
                    <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>Rejection Reason:</span>
                      </div>
                      <p className="text-dandiya-ivory/90 pl-6">
                        {item.rejectionReason || "UTR not found in college bank ledger or transaction cancelled."}
                      </p>
                      <p className="text-[11px] text-dandiya-ivory/60 pl-6 pt-1">
                        Please contact the organizing committee or submit a valid transaction reference.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
