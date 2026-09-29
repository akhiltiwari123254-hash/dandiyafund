"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { formatINR, maskUTR } from "@/lib/utils";

interface SummaryData {
  totalAll: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedFund: number;
}

interface RequestItem {
  id: string;
  requestId: string;
  amount: number;
  utr: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  student: {
    name: string;
    rollNo: string;
    registrationNo: string;
    batch: string;
  };
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<SummaryData>({
    totalAll: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalApprovedFund: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/requests?limit=6");
        const data = await res.json();
        if (data.success) {
          setSummary(data.summary);
          setRecentRequests(data.requests);
        }
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            Executive Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
            Event Fund Dashboard
          </h1>
          <p className="text-xs text-dandiya-ivory/60 mt-1">
            Real-time financial reconciliation & verification overview for Dandiya Night 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/requests?status=PENDING"
            className="px-4 py-2 text-xs font-bold text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light rounded-xl shadow-gold flex items-center gap-1.5 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Verify Pending ({summary.pendingCount})</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Fund */}
        <div className="p-5 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold">
          <div className="flex items-center justify-between text-dandiya-gold/80 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Fund</span>
            <HeartHandshake className="w-4 h-4 text-dandiya-saffron" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-dandiya-gold-light">
            {loading ? "..." : formatINR(summary.totalApprovedFund)}
          </p>
          <span className="text-[11px] text-dandiya-ivory/50 mt-1 block">
            Approved transactions only
          </span>
        </div>

        {/* Pending Requests */}
        <div className="p-5 rounded-2xl bg-[#1C0A19] border border-amber-500/30 shadow-sm">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-300">
            {loading ? "..." : summary.pendingCount}
          </p>
          <span className="text-[11px] text-dandiya-ivory/50 mt-1 block">
            Awaiting bank reconciliation
          </span>
        </div>

        {/* Approved Requests */}
        <div className="p-5 rounded-2xl bg-[#1C0A19] border border-emerald-500/30 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-400">
            {loading ? "..." : summary.approvedCount}
          </p>
          <span className="text-[11px] text-dandiya-ivory/50 mt-1 block">
            Verified in bank ledger
          </span>
        </div>

        {/* Rejected Requests */}
        <div className="p-5 rounded-2xl bg-[#1C0A19] border border-red-500/30 shadow-sm">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Rejected</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-extrabold text-red-400">
            {loading ? "..." : summary.rejectedCount}
          </p>
          <span className="text-[11px] text-dandiya-ivory/50 mt-1 block">
            Excluded from total fund
          </span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/requests"
          className="p-4 rounded-xl bg-[#160614] border border-dandiya-border/70 hover:border-dandiya-gold flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-dandiya-wine border border-dandiya-border text-dandiya-gold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-dandiya-ivory group-hover:text-dandiya-gold transition-colors">
                Payment Verification
              </p>
              <p className="text-[11px] text-dandiya-ivory/50">Approve or reject UTRs</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-dandiya-ivory/40 group-hover:text-dandiya-gold transition-colors" />
        </Link>

        <Link
          href="/admin/import"
          className="p-4 rounded-xl bg-[#160614] border border-dandiya-border/70 hover:border-dandiya-gold flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-dandiya-wine border border-dandiya-border text-dandiya-gold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-dandiya-ivory group-hover:text-dandiya-gold transition-colors">
                Import Student Excel
              </p>
              <p className="text-[11px] text-dandiya-ivory/50">Batch upload student directory</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-dandiya-ivory/40 group-hover:text-dandiya-gold transition-colors" />
        </Link>

        <Link
          href="/admin/settings"
          className="p-4 rounded-xl bg-[#160614] border border-dandiya-border/70 hover:border-dandiya-gold flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-dandiya-wine border border-dandiya-border text-dandiya-gold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-dandiya-ivory group-hover:text-dandiya-gold transition-colors">
                Event Settings
              </p>
              <p className="text-[11px] text-dandiya-ivory/50">Update UPI ID, QR & WhatsApp</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-dandiya-ivory/40 group-hover:text-dandiya-gold transition-colors" />
        </Link>
      </div>

      {/* Recent Payment Requests Table */}
      <div className="p-6 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold space-y-4">
        <div className="flex items-center justify-between border-b border-dandiya-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dandiya-saffron" />
            <h2 className="text-base font-serif font-bold text-dandiya-gold">
              Recent Transactions
            </h2>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-semibold text-dandiya-gold hover:text-dandiya-gold-light flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequests.length === 0 && !loading && (
          <p className="text-xs text-dandiya-ivory/50 text-center py-6">
            No transactions registered yet.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-dandiya-border/30 text-dandiya-gold/80 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Roll / Reg</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">UTR Reference</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dandiya-border/20 text-dandiya-ivory/80">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-dandiya-wine/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-dandiya-gold-light">
                    {req.requestId}
                  </td>
                  <td className="py-3 px-3 font-medium text-dandiya-ivory">
                    {req.student.name}
                  </td>
                  <td className="py-3 px-3 text-dandiya-ivory/60">
                    {req.student.rollNo}
                  </td>
                  <td className="py-3 px-3 font-bold text-dandiya-gold">
                    {formatINR(req.amount)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-dandiya-ivory/60">
                    {maskUTR(req.utr)}
                  </td>
                  <td className="py-3 px-3">
                    {req.status === "APPROVED" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold text-[10px]">
                        APPROVED
                      </span>
                    )}
                    {req.status === "PENDING" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold text-[10px]">
                        PENDING
                      </span>
                    )}
                    {req.status === "REJECTED" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 font-semibold text-[10px]">
                        REJECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/requests"
                      className="text-dandiya-gold hover:underline font-semibold text-[11px]"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
