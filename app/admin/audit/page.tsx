"use client";

import React, { useEffect, useState } from "react";
import { History, Shield, Clock } from "lucide-react";

interface AuditItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetId: string | null;
  details: string | null;
  timestamp: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/admin/audit");
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch {
        console.error("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
          Accountability
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
          Administrative Audit Trail
        </h1>
        <p className="text-xs text-dandiya-ivory/60 mt-1">
          Immutable log of all verifications, rejections, imports, and configuration updates.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-dandiya-gold">
            Loading audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-dandiya-ivory/50">
            No audit actions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dandiya-border/40 text-dandiya-gold font-bold uppercase tracking-wider text-[10px] bg-[#160614]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Record</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dandiya-border/20 text-dandiya-ivory/80">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-dandiya-wine/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-dandiya-ivory/60">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-dandiya-ivory">
                      {log.adminName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold font-mono text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-dandiya-gold-light">
                      {log.targetId || "—"}
                    </td>
                    <td className="py-3 px-4 text-dandiya-ivory/60 font-mono text-[11px] max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
