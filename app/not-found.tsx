import React from "react";
import Link from "next/link";
import { Music, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#120510] text-[#FDFBF7] px-4">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[#1C0A19]/90 border border-dandiya-border shadow-gold-lg space-y-6">
        {/* Cultural Dandiya Motif */}
        <div className="w-20 h-20 rounded-full bg-dandiya-wine border border-dandiya-border text-dandiya-gold flex items-center justify-center mx-auto shadow-gold">
          <Music className="w-9 h-9 text-dandiya-saffron animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
            404 • Missing Track
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
            Oops! This page wandered off the dance floor.
          </h1>
          <p className="text-xs text-dandiya-ivory/70 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has moved to another rhythm.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light to-dandiya-gold hover:opacity-95 transition-all shadow-gold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dandiya Night</span>
        </Link>
      </div>
    </div>
  );
}
