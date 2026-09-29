"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface StudentItem {
  id: string;
  name: string;
  rollNo: string;
  registrationNo: string;
  batch: string;
  createdAt: string;
  _count: {
    requests: number;
  };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Manual Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");
  const [newReg, setNewReg] = useState("");
  const [newBatch, setNewBatch] = useState("2026");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/students?search=${encodeURIComponent(
        search
      )}&batch=${batchFilter}&page=${page}&limit=20`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
        setTotalStudents(data.stats.totalStudents);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [search, batchFilter, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    setIsAdding(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          rollNo: newRoll.trim(),
          registrationNo: newReg.trim(),
          batch: newBatch,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAddError(data.message || "Failed to add student");
      } else {
        setAddSuccess("Student added successfully!");
        setNewName("");
        setNewRoll("");
        setNewReg("");
        fetchStudents();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAddSuccess("");
        }, 1200);
      }
    } catch {
      setAddError("Network error while adding student.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            Student Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
            Student Database ({totalStudents})
          </h1>
          <p className="text-xs text-dandiya-ivory/60 mt-1">
            Registered students eligible to contribute for Dandiya Night 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/admin/students/export"
            download
            className="px-3.5 py-2 text-xs font-semibold text-dandiya-gold hover:text-dandiya-gold-light bg-dandiya-wine border border-dandiya-border rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <Link
            href="/admin/import"
            className="px-3.5 py-2 text-xs font-bold text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import Excel / CSV</span>
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-dandiya-ivory bg-[#250C20] border border-dandiya-border hover:border-dandiya-gold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-dandiya-saffron" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1C0A19] border border-dandiya-border flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Batch Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["ALL", "2023", "2024", "2025", "2026"].map((b) => (
            <button
              key={b}
              onClick={() => {
                setBatchFilter(b);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                batchFilter === b
                  ? "bg-dandiya-gold text-dandiya-wine font-bold"
                  : "text-dandiya-ivory/70 hover:bg-dandiya-wine hover:text-dandiya-gold"
              }`}
            >
              {b === "ALL" ? "All Batches" : `Batch ${b}`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, roll, or reg no..."
            className="w-full pl-9 pr-4 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/40 text-xs focus:border-dandiya-gold focus:outline-none"
          />
          <Search className="w-4 h-4 text-dandiya-gold/60 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-dandiya-gold">
            Loading student directory...
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-xs text-dandiya-ivory/50">
            No students found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dandiya-border/40 text-dandiya-gold font-bold uppercase tracking-wider text-[10px] bg-[#160614]">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Registration No.</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Contributions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dandiya-border/20 text-dandiya-ivory/80">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-dandiya-wine/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-dandiya-ivory">
                      {stu.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-dandiya-gold-light">
                      {stu.rollNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-dandiya-ivory/70">
                      {stu.registrationNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold text-[10px] font-semibold">
                        Batch {stu.batch}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dandiya-ivory/60">
                      {stu._count.requests > 0 ? (
                        <span className="text-emerald-400 font-semibold">
                          {stu._count.requests} record(s)
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1C0A19] border border-dandiya-border shadow-gold-lg space-y-4">
            <h3 className="text-base font-serif font-bold text-dandiya-gold">
              Add New Student Record
            </h3>

            {addError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            {addSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{addSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Manisha Iyer"
                  className="w-full px-3 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoll}
                    onChange={(e) => setNewRoll(e.target.value.toUpperCase())}
                    placeholder="e.g. 26CS032"
                    className="w-full px-3 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    required
                    value={newReg}
                    onChange={(e) => setNewReg(e.target.value)}
                    placeholder="e.g. 202600232"
                    className="w-full px-3 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                  Batch
                </label>
                <select
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                >
                  <option value="2023">Batch 2023</option>
                  <option value="2024">Batch 2024</option>
                  <option value="2025">Batch 2025</option>
                  <option value="2026">Batch 2026</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-dandiya-ivory/70 hover:text-dandiya-ivory rounded-xl hover:bg-dandiya-wine"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 py-2 text-xs font-bold text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light rounded-xl transition-all shadow-sm"
                >
                  {isAdding ? "Saving..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
