import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Server } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#120510] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-dandiya-gold hover:text-dandiya-gold-light"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            Data Governance & Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dandiya-gold-light">
            Privacy Policy
          </h1>
          <p className="text-xs text-dandiya-ivory/60">
            Last Updated: September 2026 • Dandiya Night Organizing Committee
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold space-y-6 text-sm text-dandiya-ivory/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-dandiya-gold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-dandiya-saffron" />
              1. Core Privacy Philosophy
            </h2>
            <p>
              We believe student contributions should never become an avenue for social comparison, peer pressure, or public scrutiny. To protect our student body:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-dandiya-ivory/70">
              <li>Batch-wise contribution totals are strictly prohibited and never displayed.</li>
              <li>Public contributor lists and leaderboards are disabled by design.</li>
              <li>Individual student payment amounts and full UTR numbers are never made public.</li>
              <li>Only aggregate totals (Total Fund Collected & Total Contributor Count) are visible on the dashboard.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-dandiya-gold flex items-center gap-2">
              <Lock className="w-4 h-4 text-dandiya-saffron" />
              2. Student Data Collected
            </h2>
            <p>
              The platform stores pre-enrolled college student directory information consisting of:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-dandiya-ivory/70">
              <li>Student Name</li>
              <li>Roll Number & Registration Number</li>
              <li>College Batch Year (2023, 2024, 2025, or 2026)</li>
              <li>Submitted transaction reference (UTR) and contribution amount</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-dandiya-gold flex items-center gap-2">
              <Server className="w-4 h-4 text-dandiya-saffron" />
              3. Purpose & Verification
            </h2>
            <p>
              Data is collected solely to cross-verify voluntary student payments against the college organizing bank account ledger. Only authorized administrators (Aaditya Gupta & Akhil Tiwari) possess access to review and approve transaction references.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-dandiya-gold flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-dandiya-saffron" />
              4. Masking & Sensitive Displays
            </h2>
            <p>
              When a student checks their transaction status on the public portal, the transaction reference (UTR) is masked (e.g. <code>••••••••9012</code>) so that shoulder-surfers or unauthorized third parties cannot copy sensitive banking details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-dandiya-gold">
              5. Contact & Support
            </h2>
            <p>
              If you have any questions regarding your student data or payment status, contact the student organizing committee via the WhatsApp link on your contribution receipt or reach out to the event desk at the student cultural office.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
