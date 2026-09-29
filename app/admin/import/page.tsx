"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

interface ParsedRow {
  name: string;
  rollNo: string;
  registrationNo: string;
  batch: string;
  status: "VALID" | "DUPLICATE" | "INVALID";
  reason?: string;
}

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    valid: 0,
    duplicates: 0,
    invalid: 0,
  });
  const [importMode, setImportMode] = useState<"add_new" | "update_existing" | "skip_duplicates">(
    "skip_duplicates"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{
    added: number;
    updated: number;
    skipped: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: File selection & parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage("");
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length < 2) {
          setErrorMessage("The uploaded spreadsheet is empty or missing data rows.");
          return;
        }

        const headers: string[] = data[0].map((h: any) => String(h || "").trim());
        setDetectedColumns(headers);

        // Map column indexes
        const nameIdx = headers.findIndex((h) => /name/i.test(h));
        const rollIdx = headers.findIndex((h) => /roll/i.test(h));
        const regIdx = headers.findIndex((h) => /reg/i.test(h));
        const batchIdx = headers.findIndex((h) => /batch/i.test(h));

        if (nameIdx === -1 || rollIdx === -1 || regIdx === -1) {
          setErrorMessage(
            "Could not automatically detect required columns. Please ensure columns include 'Name', 'Roll Number', and 'Registration Number'."
          );
          return;
        }

        const parsedRows: ParsedRow[] = [];
        const seenRegs = new Set<string>();
        const seenRolls = new Set<string>();
        let validCount = 0;
        let dupCount = 0;
        let invalidCount = 0;

        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0) continue;

          const name = String(row[nameIdx] || "").trim();
          const rollNo = String(row[rollIdx] || "").trim();
          const registrationNo = String(row[regIdx] || "").trim();
          let batch = batchIdx !== -1 ? String(row[batchIdx] || "").trim() : "2026";

          if (!batch || !/202[3-6]/.test(batch)) {
            batch = "2026"; // Fallback to current year
          }

          if (!name || !rollNo || !registrationNo) {
            invalidCount++;
            parsedRows.push({
              name,
              rollNo,
              registrationNo,
              batch,
              status: "INVALID",
              reason: "Missing name, roll, or registration number",
            });
          } else if (seenRegs.has(registrationNo) || seenRolls.has(rollNo)) {
            dupCount++;
            parsedRows.push({
              name,
              rollNo,
              registrationNo,
              batch,
              status: "DUPLICATE",
              reason: "Duplicate registration or roll in file",
            });
          } else {
            seenRegs.add(registrationNo);
            seenRolls.add(rollNo);
            validCount++;
            parsedRows.push({
              name,
              rollNo,
              registrationNo,
              batch,
              status: "VALID",
            });
          }
        }

        setRows(parsedRows);
        setSummary({
          total: parsedRows.length,
          valid: validCount,
          duplicates: dupCount,
          invalid: invalidCount,
        });
      } catch (err) {
        console.error("Parse error", err);
        setErrorMessage("Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
      }
    };

    reader.readAsBinaryString(selected);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const wsData = [
      ["Name", "Roll Number", "Registration Number", "Batch"],
      ["Rahul Kumar", "23CS001", "202300101", "2023"],
      ["Ananya Sharma", "24CS014", "202400114", "2024"],
      ["Siddharth Rao", "25EC045", "202500145", "2025"],
      ["Rhea Saxena", "26IT012", "202600112", "2026"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "dandiya_student_database_template.xlsx");
  };

  // Step 6: Confirm and Execute Import
  const handleExecuteImport = async () => {
    const validRecords = rows.filter((r) => r.status === "VALID" || importMode === "update_existing");
    if (validRecords.length === 0) {
      setErrorMessage("No valid records to import.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: validRecords.map((r) => ({
            name: r.name,
            rollNo: r.rollNo,
            registrationNo: r.registrationNo,
            batch: r.batch,
          })),
          mode: importMode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Import execution failed");
      } else {
        setImportResult(data.summary);
      }
    } catch {
      setErrorMessage("Network error during batch import.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            Batch Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
            Import Student Database
          </h1>
          <p className="text-xs text-dandiya-ivory/60 mt-1">
            Upload Excel (.xlsx, .xls) or CSV files containing hundreds of students across batches 2023–2026.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="px-4 py-2 text-xs font-semibold text-dandiya-gold hover:text-dandiya-gold-light bg-dandiya-wine border border-dandiya-border rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Download className="w-4 h-4 text-dandiya-saffron" />
          <span>Download Sample Template</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Upload Dropzone */}
      <div className="p-8 rounded-2xl bg-[#1C0A19] border-2 border-dashed border-dandiya-border hover:border-dandiya-gold/80 transition-all text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-dandiya-wine border border-dandiya-gold/40 flex items-center justify-center text-dandiya-gold mx-auto shadow-gold">
          <Upload className="w-7 h-7 text-dandiya-saffron" />
        </div>
        <div>
          <label className="cursor-pointer">
            <span className="px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light inline-block shadow-gold transition-all">
              Choose Excel / CSV File
            </span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-dandiya-ivory/60 mt-2">
            Supports .xlsx, .xls, and .csv with columns: Name, Roll Number, Registration Number, Batch.
          </p>
        </div>
        {file && (
          <p className="text-xs text-dandiya-gold font-medium">
            Selected File: <strong className="text-dandiya-ivory">{file.name}</strong>
          </p>
        )}
      </div>

      {/* STEP 2 to 5: Inspection & Validation Summary */}
      {rows.length > 0 && (
        <div className="space-y-6">
          {/* Validation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#160614] border border-dandiya-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-dandiya-ivory/50 block font-bold">
                Total Rows
              </span>
              <p className="text-2xl font-serif font-bold text-dandiya-ivory mt-1">
                {summary.total}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#160614] border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-bold">
                Valid Records
              </span>
              <p className="text-2xl font-serif font-bold text-emerald-400 mt-1">
                {summary.valid}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#160614] border border-amber-500/30 text-center">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 block font-bold">
                Duplicates in File
              </span>
              <p className="text-2xl font-serif font-bold text-amber-400 mt-1">
                {summary.duplicates}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#160614] border border-red-500/30 text-center">
              <span className="text-[10px] uppercase tracking-wider text-red-400 block font-bold">
                Invalid / Empty
              </span>
              <p className="text-2xl font-serif font-bold text-red-400 mt-1">
                {summary.invalid}
              </p>
            </div>
          </div>

          {/* STEP 3: Preview First 15 Rows */}
          <div className="p-5 rounded-2xl bg-[#1C0A19] border border-dandiya-border space-y-3">
            <div className="flex items-center justify-between border-b border-dandiya-border/40 pb-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-dandiya-gold">
                Data Preview (First 15 Rows)
              </h3>
              <span className="text-[11px] text-dandiya-ivory/50">
                Detected columns: {detectedColumns.join(", ")}
              </span>
            </div>

            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-dandiya-border/30 text-dandiya-gold font-semibold text-[11px] bg-[#140612] sticky top-0">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3">Roll No.</th>
                    <th className="py-2 px-3">Registration No.</th>
                    <th className="py-2 px-3">Batch</th>
                    <th className="py-2 px-3">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dandiya-border/20 text-dandiya-ivory/80">
                  {rows.slice(0, 15).map((r, idx) => (
                    <tr key={idx} className="hover:bg-dandiya-wine/30">
                      <td className="py-2.5 px-3 text-dandiya-ivory/40">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-dandiya-ivory">{r.name || "—"}</td>
                      <td className="py-2.5 px-3 font-mono text-dandiya-gold-light">{r.rollNo || "—"}</td>
                      <td className="py-2.5 px-3 font-mono text-dandiya-ivory/60">{r.registrationNo || "—"}</td>
                      <td className="py-2.5 px-3">{r.batch}</td>
                      <td className="py-2.5 px-3">
                        {r.status === "VALID" && (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        )}
                        {r.status === "DUPLICATE" && (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[10px]" title={r.reason}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Duplicate</span>
                          </span>
                        )}
                        {r.status === "INVALID" && (
                          <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-[10px]" title={r.reason}>
                            <XCircle className="w-3 h-3" />
                            <span>Invalid</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 6: Import Mode & Confirmation */}
          <div className="p-6 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold space-y-4">
            <h3 className="text-sm font-serif font-bold text-dandiya-gold">
              Step 6: Import Configuration & Confirmation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  importMode === "skip_duplicates"
                    ? "bg-dandiya-wine border-dandiya-gold text-dandiya-gold font-bold shadow-sm"
                    : "bg-[#140612] border-dandiya-border text-dandiya-ivory/70"
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="skip_duplicates"
                  checked={importMode === "skip_duplicates"}
                  onChange={() => setImportMode("skip_duplicates")}
                  className="hidden"
                />
                <p className="font-semibold">Skip Duplicates</p>
                <p className="text-[11px] text-dandiya-ivory/50 mt-1 font-normal">
                  Add new records; ignore any registration numbers already in database.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  importMode === "update_existing"
                    ? "bg-dandiya-wine border-dandiya-gold text-dandiya-gold font-bold shadow-sm"
                    : "bg-[#140612] border-dandiya-border text-dandiya-ivory/70"
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="update_existing"
                  checked={importMode === "update_existing"}
                  onChange={() => setImportMode("update_existing")}
                  className="hidden"
                />
                <p className="font-semibold">Update Existing</p>
                <p className="text-[11px] text-dandiya-ivory/50 mt-1 font-normal">
                  Update student name and roll if registration number matches an existing record.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  importMode === "add_new"
                    ? "bg-dandiya-wine border-dandiya-gold text-dandiya-gold font-bold shadow-sm"
                    : "bg-[#140612] border-dandiya-border text-dandiya-ivory/70"
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value="add_new"
                  checked={importMode === "add_new"}
                  onChange={() => setImportMode("add_new")}
                  className="hidden"
                />
                <p className="font-semibold">Add New Only</p>
                <p className="text-[11px] text-dandiya-ivory/50 mt-1 font-normal">
                  Insert records that have never been seen before.
                </p>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-dandiya-ivory/60">
                Ready to process <strong>{summary.valid}</strong> valid records.
              </span>
              <button
                onClick={handleExecuteImport}
                disabled={isProcessing || summary.valid === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all shadow-gold flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Importing records...</span>
                ) : (
                  <>
                    <span>Confirm & Import Valid Records</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Success Receipt */}
      {importResult && (
        <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 shadow-gold text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-emerald-300">
            Batch Import Completed Successfully
          </h3>
          <p className="text-xs text-dandiya-ivory/80">
            Imported <strong>{importResult.added}</strong> new students, updated{" "}
            <strong>{importResult.updated}</strong>, and skipped <strong>{importResult.skipped}</strong> duplicate/invalid rows.
          </p>
        </div>
      )}
    </div>
  );
}
