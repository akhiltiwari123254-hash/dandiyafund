"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  HeartHandshake,
  Search,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  HelpCircle,
  ChevronDown,
  Music,
  Users,
  Award,
  RotateCcw,
} from "lucide-react";
import DandiyaOpeningAnimation from "@/components/intro/DandiyaOpeningAnimation";
import { formatINR } from "@/lib/utils";

interface StatsData {
  totalFund: number;
  totalContributors: number;
}

interface SettingsData {
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventDescription: string;
  minAmount: number;
  maxAmount: number;
  adminDisplayName: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData>({ totalFund: 0, totalContributors: 0 });
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replayIntro, setReplayIntro] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/public/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const faqs = [
    {
      q: "How does the contribution and verification process work?",
      a: "Select your student record, enter your contribution amount, scan the provided official event UPI QR, and complete the payment on your UPI app (Google Pay, PhonePe, Paytm, etc.). Then enter the 12-digit UTR / transaction reference and submit. Our student admin team cross-verifies the UTR with our college bank statement before approving it.",
    },
    {
      q: "What is a UTR number and where can I find it?",
      a: "A UTR (Unique Transaction Reference) or UPI Reference Number is a 12-digit alphanumeric code generated for every UPI payment. You can find it in your UPI app's transaction history under 'UPI Ref No.', 'UTR', or 'Transaction ID'.",
    },
    {
      q: "Why is my payment status showing 'PENDING'?",
      a: "All contributions are manually verified against bank records by our administrative team to maintain 100% financial integrity. Verifications typically happen within a few hours.",
    },
    {
      q: "Is batch-wise contribution or individual donation publicly shown?",
      a: "No! Out of respect for student privacy and to prevent any social competition, the public dashboard only shows the overall aggregate fund and total number of contributors. Your individual payment amount and batch statistics are strictly confidential.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#120510] text-[#FDFBF7] overflow-hidden">
      {/* Signature Dandiya Opening Animation */}
      <DandiyaOpeningAnimation forcePlay={replayIntro} onComplete={() => setReplayIntro(false)} />

      {/* Replay Intro Floating Button */}
      <button
        onClick={() => setReplayIntro(true)}
        className="fixed bottom-6 left-6 z-30 hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-dandiya-gold bg-[#1F091B]/90 hover:bg-[#2B0E25] border border-dandiya-border rounded-full backdrop-blur-md shadow-gold transition-all"
        title="Replay Cultural Opening Animation"
      >
        <RotateCcw className="w-3.5 h-3.5 text-dandiya-saffron" />
        <span>Replay Intro</span>
      </button>

      {/* Ambient Cultural Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-radial from-[#781D39]/25 via-[#3D0C22]/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-48 right-10 w-96 h-96 bg-[#E65C00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Cultural Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold text-xs uppercase tracking-widest font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron" />
          <span>Annual College Raas-Garba Utsav</span>
          <span className="w-1.5 h-1.5 rounded-full bg-dandiya-saffron" />
          <span className="text-dandiya-ivory/80">Batch 2023–2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#F3E5AB] to-[#D4AF37] leading-[1.15] drop-shadow-sm">
          {settings?.eventName || "DANDIYA NIGHT 2026"}
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-dandiya-ivory/80 max-w-2xl mx-auto font-light leading-relaxed">
          {settings?.eventDescription ||
            "Immerse in an enchanted evening of traditional Gujarati dhol beats, radiant ethnic attire, energetic Garba circles, and festive togetherness."}
        </p>

        {/* Event Schedule Info Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-dandiya-gold/90 font-medium">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dandiya-wine/80 border border-dandiya-border">
            <Calendar className="w-4 h-4 text-dandiya-saffron" />
            <span>{settings?.eventDate || "October 18, 2026"}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dandiya-wine/80 border border-dandiya-border">
            <MapPin className="w-4 h-4 text-dandiya-saffron" />
            <span>{settings?.eventVenue || "Central Amphitheater & Lawns"}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dandiya-wine/80 border border-dandiya-border">
            <Clock className="w-4 h-4 text-dandiya-saffron" />
            <span>6:30 PM Onwards</span>
          </div>
        </div>

        {/* Primary Statistics Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Total Fund Collected */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#290C20]/90 to-[#1A0715]/90 border border-dandiya-border shadow-gold text-left overflow-hidden group hover:border-dandiya-gold transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-dandiya-saffron/10 rounded-full blur-2xl group-hover:bg-dandiya-saffron/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-dandiya-gold/80 font-bold">
                Total Fund Collected
              </span>
              <div className="p-2 rounded-xl bg-dandiya-maroon border border-dandiya-border text-dandiya-gold">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-dandiya-gold-light tracking-tight">
              {loading ? (
                <span className="inline-block w-36 h-10 bg-dandiya-wine/60 animate-pulse rounded-lg" />
              ) : (
                formatINR(stats.totalFund)
              )}
            </div>
            <p className="mt-2 text-xs text-dandiya-ivory/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strictly verified & approved funds</span>
            </p>
          </div>

          {/* Total Contributors */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#290C20]/90 to-[#1A0715]/90 border border-dandiya-border shadow-gold text-left overflow-hidden group hover:border-dandiya-gold transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-dandiya-gold/10 rounded-full blur-2xl group-hover:bg-dandiya-gold/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-dandiya-gold/80 font-bold">
                Total Contributors
              </span>
              <div className="p-2 rounded-xl bg-dandiya-maroon border border-dandiya-border text-dandiya-gold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-dandiya-gold-light tracking-tight">
              {loading ? (
                <span className="inline-block w-24 h-10 bg-dandiya-wine/60 animate-pulse rounded-lg" />
              ) : (
                `${stats.totalContributors} Students`
              )}
            </div>
            <p className="mt-2 text-xs text-dandiya-ivory/60 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-dandiya-saffron" />
              <span>Across all college batches</span>
            </p>
          </div>
        </div>

        {/* Verification Trust Notice */}
        <div className="mt-6 max-w-xl mx-auto px-4 py-3 rounded-xl bg-dandiya-wine/40 border border-dandiya-border/60 text-xs text-dandiya-ivory/80 leading-relaxed flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-dandiya-saffron flex-shrink-0" />
          <span>
            Contributions are verified by the event administration before being added to the total fund.
          </span>
        </div>

        {/* Dual Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contribute"
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron rounded-full shadow-gold-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5" />
            <span>Contribute Now</span>
          </Link>

          <Link
            href="/status"
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-semibold text-dandiya-gold hover:text-dandiya-gold-light bg-dandiya-wine/80 hover:bg-dandiya-wine border border-dandiya-border hover:border-dandiya-gold rounded-full transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-dandiya-saffron" />
            <span>Check Payment Status</span>
          </Link>
        </div>
      </section>

      {/* Cultural Features / Highlights */}
      <section id="guidelines" className="py-16 bg-[#160614] border-y border-dandiya-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
              Celebrate Together
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-dandiya-ivory mt-2">
              Event Highlights & Community Spirit
            </h2>
            <p className="mt-2 text-sm text-dandiya-ivory/70">
              Every single rupee contributed goes directly towards creating a memorable, authentic Dandiya experience for all college students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#210B1B]/80 border border-dandiya-border/70 hover:border-dandiya-gold transition-all">
              <div className="w-12 h-12 rounded-xl bg-dandiya-maroon border border-dandiya-border flex items-center justify-center text-dandiya-gold mb-4">
                <Music className="w-6 h-6 text-dandiya-saffron" />
              </div>
              <h3 className="font-serif font-bold text-lg text-dandiya-gold-light mb-2">
                Live Dhol & Garba Beats
              </h3>
              <p className="text-sm text-dandiya-ivory/70 leading-relaxed">
                Authentic Gujarati folk melodies and energetic live percussionists performing traditional 2-taali and 3-taali Garba rhythms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#210B1B]/80 border border-dandiya-border/70 hover:border-dandiya-gold transition-all">
              <div className="w-12 h-12 rounded-xl bg-dandiya-maroon border border-dandiya-border flex items-center justify-center text-dandiya-gold mb-4">
                <Sparkles className="w-6 h-6 text-dandiya-saffron" />
              </div>
              <h3 className="font-serif font-bold text-lg text-dandiya-gold-light mb-2">
                Festive Food & Refreshments
              </h3>
              <p className="text-sm text-dandiya-ivory/70 leading-relaxed">
                Student-budget friendly authentic festive snacks, beverages, and traditional sweets managed cleanly across hygienic stalls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#210B1B]/80 border border-dandiya-border/70 hover:border-dandiya-gold transition-all">
              <div className="w-12 h-12 rounded-xl bg-dandiya-maroon border border-dandiya-border flex items-center justify-center text-dandiya-gold mb-4">
                <ShieldCheck className="w-6 h-6 text-dandiya-saffron" />
              </div>
              <h3 className="font-serif font-bold text-lg text-dandiya-gold-light mb-2">
                100% Financial Integrity
              </h3>
              <p className="text-sm text-dandiya-ivory/70 leading-relaxed">
                Zero private middlemen. All funds are received directly into the official event account and accounted for by appointed administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-ivory mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#1C0A19]/90 border border-dandiya-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-dandiya-gold hover:text-dandiya-gold-light transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-dandiya-saffron transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-sm text-dandiya-ivory/80 leading-relaxed border-t border-dandiya-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
