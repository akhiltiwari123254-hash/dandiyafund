"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
  Filter,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PaymentRequestItem {
  id: string;
  requestId: string;
  amount: number;
  utr: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  verifiedBy: string | null;
  submittedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  student: {
    id: string;
    name: string;
    rollNo: string;
    registrationNo: string;
    batch: string;
  };
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PaymentRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [confirmApproveModal, setConfirmApproveModal] = useState<PaymentRequestItem | null>(null);
  const [rejectModal, setRejectModal] = useState<PaymentRequestItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setActionError("");
    try {
      const url = `/api/admin/requests?status=${statusFilter}&search=${encodeURIComponent(
        search
      )}&page=${page}&limit=15`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch {
      setActionError("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Execute approval
  const handleApprove = async () => {
    if (!confirmApproveModal) return;
    setIsProcessing(true);
    setActionError("");

    try {
      const res = await fetch("/api/admin/requests/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: confirmApproveModal.requestId,
          action: "APPROVE",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Failed to approve transaction.");
      } else {
        setActionSuccess(`Request ${confirmApproveModal.requestId} successfully APPROVED!`);
        setConfirmApproveModal(null);
        fetchRequests();
        setTimeout(() => setActionSuccess(""), 4000);
      }
    } catch {
      setActionError("Network error while approving.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute rejection
  const handleReject = async () => {
    if (!rejectModal) return;
    setIsProcessing(true);
    setActionError("");

    try {
      const res = await fetch("/api/admin/requests/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: rejectModal.requestId,
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Failed to reject transaction.");
      } else {
        setActionSuccess(`Request ${rejectModal.requestId} successfully REJECTED.`);
        setRejectModal(null);
        setRejectionReason("");
        fetchRequests();
        setTimeout(() => setActionSuccess(""), 4000);
      }
    } catch {
      setActionError("Network error while rejecting.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
          Verification Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
          Payment Requests
        </h1>
        <p className="text-xs text-dandiya-ivory/60 mt-1">
          Review, cross-verify UTRs with college bank statement, and approve or reject student contributions.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1C0A19] border border-dandiya-border flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === tab
                  ? "bg-dandiya-gold text-dandiya-wine font-bold shadow-sm"
                  : "text-dandiya-ivory/70 hover:bg-dandiya-wine/60 hover:text-dandiya-gold"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search student, UTR, or Request ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/40 text-xs focus:border-dandiya-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-dandiya-gold/60 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Requests Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-dandiya-gold">
            Loading payment requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-dandiya-ivory/50">
            No payment requests found matching your filter.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-dandiya-border/40 text-dandiya-gold font-bold uppercase tracking-wider text-[10px] bg-[#160614]">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll / Reg</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Bank UTR Reference</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dandiya-border/20 text-dandiya-ivory/80">
                  {requests.map((r) => {
                    const isPending = r.status === "PENDING";
                    return (
                      <tr key={r.id} className="hover:bg-dandiya-wine/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-dandiya-gold-light">
                          {r.requestId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-dandiya-ivory">
                          {r.student.name}
                        </td>
                        <td className="py-3.5 px-4 text-dandiya-ivory/60">
                          <div>{r.student.rollNo}</div>
                          <div className="text-[10px]">{r.student.registrationNo}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-dandiya-gold text-sm">
                          {formatINR(r.amount)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-dandiya-ivory select-all">
                          {r.utr}
                        </td>
                        <td className="py-3.5 px-4 text-dandiya-ivory/60 text-[11px]">
                          {new Date(r.submittedAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          {r.status === "APPROVED" && (
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold text-[10px]">
                                APPROVED
                              </span>
                              {r.verifiedBy && (
                                <span className="block text-[9px] text-dandiya-ivory/40 mt-0.5">
                                  by {r.verifiedBy}
                                </span>
                              )}
                            </div>
                          )}
                          {r.status === "PENDING" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold text-[10px]">
                              PENDING
                            </span>
                          )}
                          {r.status === "REJECTED" && (
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 font-semibold text-[10px]">
                                REJECTED
                              </span>
                              {r.rejectionReason && (
                                <span className="block text-[9px] text-red-400/80 mt-0.5 max-w-[140px] truncate" title={r.rejectionReason}>
                                  {r.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setConfirmApproveModal(r)}
                                className="px-3 py-1 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all"
                              >
                                APPROVE
                              </button>
                              <button
                                onClick={() => {
                                  setRejectModal(r);
                                  setRejectionReason("");
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-950/60 border border-red-800/60 rounded-lg transition-all"
                              >
                                REJECT
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-dandiya-ivory/40 italic">
                              Finalized
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden divide-y divide-dandiya-border/20">
              {requests.map((r) => {
                const isPending = r.status === "PENDING";
                return (
                  <div key={r.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-dandiya-gold-light text-sm">
                        {r.requestId}
                      </span>
                      {r.status === "APPROVED" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold text-[10px]">
                          APPROVED
                        </span>
                      )}
                      {r.status === "PENDING" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold text-[10px]">
                          PENDING
                        </span>
                      )}
                      {r.status === "REJECTED" && (
                        <span className="px-2 py-0.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 font-semibold text-[10px]">
                          REJECTED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-dandiya-ivory/50 block">Student:</span>
                        <strong className="text-dandiya-ivory">{r.student.name}</strong>
                      </div>
                      <div>
                        <span className="text-dandiya-ivory/50 block">Roll / Reg:</span>
                        <span className="text-dandiya-gold-light">{r.student.rollNo}</span>
                      </div>
                      <div>
                        <span className="text-dandiya-ivory/50 block">Amount:</span>
                        <strong className="text-dandiya-gold text-sm">{formatINR(r.amount)}</strong>
                      </div>
                      <div>
                        <span className="text-dandiya-ivory/50 block">Bank UTR:</span>
                        <span className="font-mono text-dandiya-ivory font-semibold text-[11px] select-all">
                          {r.utr}
                        </span>
                      </div>
                    </div>

                    {isPending ? (
                      <div className="pt-2 flex items-center gap-2 border-t border-dandiya-border/30">
                        <button
                          onClick={() => setConfirmApproveModal(r)}
                          className="flex-1 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
                        >
                          APPROVE
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(r);
                            setRejectionReason("");
                          }}
                          className="flex-1 py-2 text-xs font-semibold text-red-400 border border-red-800/60 rounded-xl hover:bg-red-950/40 transition-all"
                        >
                          REJECT
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-dandiya-ivory/40 pt-1 border-t border-dandiya-border/20">
                        {r.verifiedBy && `Verified by ${r.verifiedBy}`}
                        {r.rejectionReason && ` • Reason: ${r.rejectionReason}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* CONFIRMATION DIALOG: APPROVE */}
      {confirmApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1C0A19] border border-dandiya-border shadow-gold-lg space-y-5">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-dandiya-ivory">
                  Confirm UTR Verification
                </h3>
                <span className="text-[11px] text-dandiya-ivory/60">
                  Request ID: {confirmApproveModal.requestId}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#140612] border border-dandiya-border/60 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-dandiya-ivory/60">Student:</span>
                <span className="font-semibold text-dandiya-ivory">
                  {confirmApproveModal.student.name} ({confirmApproveModal.student.rollNo})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dandiya-ivory/60">Amount:</span>
                <span className="font-bold text-dandiya-gold text-sm">
                  {formatINR(confirmApproveModal.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dandiya-ivory/60">UTR Reference:</span>
                <span className="font-mono font-semibold text-dandiya-gold-light select-all">
                  {confirmApproveModal.utr}
                </span>
              </div>
            </div>

            <p className="text-xs text-dandiya-ivory/80 leading-relaxed">
              Are you sure you verified this UTR in the official college bank statement? Once approved, the amount will be immediately included in the Total Event Fund.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isProcessing}
                onClick={() => setConfirmApproveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-dandiya-ivory/70 hover:text-dandiya-ivory rounded-xl hover:bg-dandiya-wine"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleApprove}
                className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm"
              >
                {isProcessing ? "Approving..." : "Yes, Verified & Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1C0A19] border border-red-900/60 shadow-gold-lg space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-dandiya-ivory">
                  Reject Payment Request
                </h3>
                <span className="text-[11px] text-dandiya-ivory/60">
                  Request ID: {rejectModal.requestId}
                </span>
              </div>
            </div>

            <p className="text-xs text-dandiya-ivory/70">
              Provide a reason for rejecting this transaction reference. The student will be able to see this reason on their status tracking page.
            </p>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold">
                Quick Rejection Reasons
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "UTR reference not found in bank statement",
                  "Payment amount mismatch",
                  "Duplicate reference code",
                  "Transaction cancelled by sender",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-[#140612] border border-dandiya-border/60 hover:border-dandiya-gold text-dandiya-ivory/80 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Custom Note / Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter explanation for rejection..."
                className="w-full px-3 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isProcessing}
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-xs font-semibold text-dandiya-ivory/70 hover:text-dandiya-ivory rounded-xl hover:bg-dandiya-wine"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleReject}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-sm"
              >
                {isProcessing ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
