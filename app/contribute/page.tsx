"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageCircle,
  Sparkles,
  QrCode as QrIcon,
  RotateCcw,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  registrationNo: string;
  batch: string;
}

interface SubmittedData {
  requestId: string;
  studentName: string;
  rollNo: string;
  registrationNo: string;
  amount: number;
  maskedUtr: string;
  status: string;
  whatsAppUrl: string;
}

export default function ContributePage() {
  // Step tracker: 1 = Find Student, 2 = Enter Amount & QR, 3 = Enter UTR & Submit, 4 = Success Receipt
  const [step, setStep] = useState<number>(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState("");

  // Payment state
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("500");
  const [utr, setUtr] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-spam hidden field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Settings & QR
  const [upiId, setUpiId] = useState("dandiyanight2026@upi");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [eventName, setEventName] = useState("Dandiya Night 2026");

  // Submitted receipt
  const [receipt, setReceipt] = useState<SubmittedData | null>(null);

  // Load event settings & generate QR
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/public/stats");
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.upiId) setUpiId(data.settings.upiId);
          if (data.settings.eventName) setEventName(data.settings.eventName);
        }
      } catch (e) {
        console.error("Error loading settings", e);
      }
    }
    loadSettings();
  }, []);

  // Generate dynamic UPI QR whenever UPI ID or amount changes
  useEffect(() => {
    async function makeQR() {
      try {
        // Standard NPCI UPI URI Scheme
        const payeeName = encodeURIComponent(eventName);
        const upiUri = `upi://pay?pa=${encodeURIComponent(
          upiId
        )}&pn=${payeeName}&am=${amount}&cu=INR&tn=${encodeURIComponent(
          `Contribution for ${eventName}`
        )}`;
        const url = await QRCode.toDataURL(upiUri, {
          width: 320,
          margin: 2,
          color: {
            dark: "#1C0B18",
            light: "#FFFDF9",
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("QR generation failed", err);
      }
    }
    makeQR();
  }, [upiId, amount, eventName]);

  // Handle student search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchError("Please enter at least 2 characters to search.");
      return;
    }
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const res = await fetch("/api/contribute/search-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSearchError(data.message || "Failed to search student record");
      } else if (data.students.length === 0) {
        setSearchError("No student record found. Please verify your Registration or Roll Number.");
      } else {
        setSearchResults(data.students);
        if (data.students.length === 1) {
          setSelectedStudent(data.students[0]);
        }
      }
    } catch {
      setSearchError("Network error while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Copy UPI ID
  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Handle final submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (!utr || utr.trim().length < 6) {
      setSubmitError("Please enter a valid 12-digit UTR / UPI reference number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contribute/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          amount,
          utr: utr.trim(),
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || "Submission failed. Please check your details.");
      } else {
        setReceipt(data.data);
        setStep(4); // Success step
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120510] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron" />
            <span>Voluntary Student Contribution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron">
            Contribute to Dandiya Night 2026
          </h1>
          <p className="mt-2 text-sm text-dandiya-ivory/70 max-w-xl mx-auto">
            Find your student record, scan the official UPI QR to complete the external payment, and submit your transaction UTR for verification.
          </p>
        </div>

        {/* Progress Tracker (Steps 1 to 3) */}
        {step < 4 && (
          <div className="mb-8 flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-dandiya-wine-light -translate-y-1/2 -z-0" />
            
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 1
                    ? "bg-dandiya-gold text-dandiya-wine shadow-gold"
                    : "bg-dandiya-wine text-dandiya-ivory/50 border border-dandiya-border"
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-medium mt-1 text-dandiya-gold">Verify Student</span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 2
                    ? "bg-dandiya-gold text-dandiya-wine shadow-gold"
                    : "bg-dandiya-wine text-dandiya-ivory/50 border border-dandiya-border"
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-medium mt-1 text-dandiya-gold/80">Scan QR</span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 3
                    ? "bg-dandiya-gold text-dandiya-wine shadow-gold"
                    : "bg-dandiya-wine text-dandiya-ivory/50 border border-dandiya-border"
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-medium mt-1 text-dandiya-gold/80">Submit UTR</span>
            </div>
          </div>
        )}

        {/* STEP 1: Student Lookup */}
        {step === 1 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold space-y-6">
            <div className="border-b border-dandiya-border/40 pb-4">
              <h2 className="text-lg font-serif font-bold text-dandiya-gold">
                Step 1: Identify Your Student Record
              </h2>
              <p className="text-xs text-dandiya-ivory/60 mt-1">
                Enter your Registration Number (e.g. 202400103) or Roll Number (e.g. 24CS003) for exact verification.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="studentQuery" className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
                  Registration No. / Roll No. / Name
                </label>
                <div className="relative">
                  <input
                    id="studentQuery"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 202400103 or 24CS003"
                    className="w-full pl-11 pr-4 py-3 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory placeholder-dandiya-ivory/30 focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold transition-all text-sm"
                  />
                  <Search className="w-5 h-5 text-dandiya-gold/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {searchError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3 px-4 rounded-xl font-bold text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light to-dandiya-gold hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 shadow-gold"
              >
                {isSearching ? (
                  <span>Searching student records...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Student</span>
                  </>
                )}
              </button>
            </form>

            {/* Matching Students */}
            {searchResults.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-dandiya-border/40">
                <p className="text-xs uppercase tracking-wider font-semibold text-dandiya-gold/80">
                  Select your profile to continue:
                </p>
                <div className="space-y-2">
                  {searchResults.map((stu) => {
                    const isSelected = selectedStudent?.id === stu.id;
                    return (
                      <div
                        key={stu.id}
                        onClick={() => setSelectedStudent(stu)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-dandiya-maroon/60 border-dandiya-gold shadow-gold"
                            : "bg-[#140612] border-dandiya-border/60 hover:border-dandiya-gold/60"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-dandiya-ivory">{stu.name}</p>
                          <div className="flex items-center gap-3 text-xs text-dandiya-ivory/60">
                            <span>Roll: <strong className="text-dandiya-gold-light">{stu.rollNo}</strong></span>
                            <span>•</span>
                            <span>Reg: <strong className="text-dandiya-gold-light">{stu.registrationNo}</strong></span>
                            <span>•</span>
                            <span>Batch: <strong className="text-dandiya-gold-light">{stu.batch}</strong></span>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border border-dandiya-gold/50 flex items-center justify-center">
                          {isSelected && <div className="w-3.5 h-3.5 rounded-full bg-dandiya-gold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedStudent && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <span>Confirm & Proceed to Amount</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Amount & Scan Official UPI QR */}
        {step === 2 && selectedStudent && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold space-y-6">
            <div className="flex items-center justify-between border-b border-dandiya-border/40 pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-dandiya-gold">
                  Step 2: Choose Amount & Scan UPI QR
                </h2>
                <p className="text-xs text-dandiya-ivory/60 mt-1">
                  Contributing as: <span className="text-dandiya-gold-light font-semibold">{selectedStudent.name}</span> ({selectedStudent.rollNo})
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-dandiya-gold/80 hover:text-dandiya-gold underline"
              >
                Change Student
              </button>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-2">
                Select or Enter Contribution Amount (₹)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[200, 500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount(preset.toString());
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      amount === preset
                        ? "bg-dandiya-gold text-dandiya-wine shadow-gold"
                        : "bg-[#140612] text-dandiya-ivory/80 border border-dandiya-border hover:border-dandiya-gold"
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dandiya-gold">
                  ₹
                </span>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setAmount(val);
                  }}
                  className="w-full pl-9 pr-4 py-3 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory font-bold text-base focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold"
                  placeholder="Custom Amount"
                />
              </div>
            </div>

            {/* Official QR Code Box */}
            <div className="p-6 rounded-2xl bg-[#140612] border border-dandiya-border/80 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-dandiya-gold font-semibold uppercase tracking-wider">
                <QrIcon className="w-4 h-4 text-dandiya-saffron" />
                <span>Official Dandiya Night UPI QR Code</span>
              </div>

              {/* QR Image Render */}
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-dandiya-gold/40">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Official Event UPI QR Code"
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">
                    Generating QR...
                  </div>
                )}
              </div>

              <p className="text-xs text-dandiya-ivory/70 max-w-sm">
                Scan with any UPI App (<strong className="text-dandiya-gold-light">GPay, PhonePe, Paytm, BHIM</strong>) to pay{" "}
                <span className="text-dandiya-gold font-bold text-sm">{formatINR(amount)}</span>.
              </p>

              {/* UPI ID copy pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#230C1E] border border-dandiya-border text-xs">
                <span className="text-dandiya-ivory/60">UPI ID:</span>
                <span className="font-mono font-semibold text-dandiya-gold-light">{upiId}</span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1 hover:text-dandiya-gold transition-colors"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-dandiya-gold/70" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 shadow-gold"
            >
              <span>I have completed the payment → Enter UTR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Enter UTR Reference & Submit */}
        {step === 3 && selectedStudent && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold space-y-6">
            <div className="flex items-center justify-between border-b border-dandiya-border/40 pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-dandiya-gold">
                  Step 3: Submit Transaction Reference (UTR)
                </h2>
                <p className="text-xs text-dandiya-ivory/60 mt-1">
                  Amount: <strong className="text-dandiya-gold font-bold">{formatINR(amount)}</strong> • Student:{" "}
                  <strong className="text-dandiya-ivory">{selectedStudent.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-dandiya-gold/80 hover:text-dandiya-gold underline"
              >
                Back to QR
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-5">
              {/* Spam Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label htmlFor="utrInput" className="block text-xs font-semibold uppercase tracking-wider text-dandiya-gold/80 mb-1.5">
                  12-Digit UTR / UPI Reference No.
                </label>
                <input
                  id="utrInput"
                  type="text"
                  maxLength={30}
                  required
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                  placeholder="e.g. 427819204812"
                  className="w-full px-4 py-3.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory font-mono tracking-widest text-base focus:border-dandiya-gold focus:outline-none focus:ring-1 focus:ring-dandiya-gold"
                />
                <p className="text-[11px] text-dandiya-ivory/50 mt-1.5 leading-relaxed">
                  💡 Check your UPI transaction receipt. It is labeled as <strong>UPI Ref No.</strong>, <strong>UTR</strong>, or <strong>Transaction ID</strong>.
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-dandiya-wine/40 border border-dandiya-border/60 text-xs text-dandiya-ivory/70 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-dandiya-saffron flex-shrink-0 mt-0.5" />
                <span>
                  Our administrators verify your UTR against the college bank ledger. Duplicate or fabricated references are automatically flagged and rejected.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl font-bold uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 shadow-gold"
              >
                {isSubmitting ? (
                  <span>Recording payment request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Payment Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Success Receipt */}
        {step === 4 && receipt && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#240A1F] to-[#140612] border border-dandiya-border shadow-gold-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Payment Request Submitted
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold">
                Request ID: {receipt.requestId}
              </h2>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-xl bg-[#120510]/80 border border-dandiya-border/80 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-dandiya-border/30">
                <span className="text-dandiya-ivory/60">Student Name:</span>
                <span className="font-semibold text-dandiya-ivory">{receipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dandiya-border/30">
                <span className="text-dandiya-ivory/60">Roll Number:</span>
                <span className="font-semibold text-dandiya-ivory">{receipt.rollNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dandiya-border/30">
                <span className="text-dandiya-ivory/60">Registration No:</span>
                <span className="font-semibold text-dandiya-ivory">{receipt.registrationNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dandiya-border/30">
                <span className="text-dandiya-ivory/60">Amount:</span>
                <span className="font-bold text-dandiya-gold text-sm">{formatINR(receipt.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dandiya-border/30">
                <span className="text-dandiya-ivory/60">UTR (Masked):</span>
                <span className="font-mono text-dandiya-gold-light">{receipt.maskedUtr}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-dandiya-ivory/60">Verification Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/50 text-amber-300 font-semibold uppercase text-[10px] tracking-wider">
                  PENDING
                </span>
              </div>
            </div>

            <p className="text-xs text-dandiya-ivory/70 max-w-md mx-auto leading-relaxed">
              Your payment will be added to the event fund only after admin verification against bank records.
            </p>

            {/* Zero-Cost WhatsApp Notification Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={receipt.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Notify Admin on WhatsApp</span>
              </a>

              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-xs text-dandiya-gold hover:text-dandiya-gold-light bg-dandiya-wine border border-dandiya-border hover:border-dandiya-gold transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Payment Status</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
