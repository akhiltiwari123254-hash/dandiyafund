"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dandiya_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dandiya_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("dandiya_cookie_consent", "essential_only");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#1A0A17]/95 border border-dandiya-border text-dandiya-ivory p-5 rounded-2xl shadow-gold-lg backdrop-blur-xl transition-all animate-float"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-dandiya-maroon border border-dandiya-border text-dandiya-gold flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-xs leading-relaxed">
          <p className="font-semibold text-dandiya-gold-light text-sm">
            Privacy-First Experience
          </p>
          <p className="text-dandiya-ivory/80">
            We use strictly necessary cookies to verify administrator sessions and maintain system security. We never track private financial data.
          </p>
          <p className="text-[11px] text-dandiya-ivory/60">
            Learn more in our{" "}
            <Link href="/privacy" className="text-dandiya-gold underline hover:text-dandiya-gold-light">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5 pt-2 border-t border-dandiya-border/40">
        <button
          onClick={handleDecline}
          className="px-3.5 py-1.5 text-xs text-dandiya-ivory/70 hover:text-dandiya-ivory font-medium rounded-lg hover:bg-dandiya-wine/60 transition-colors"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 text-xs font-bold text-dandiya-wine bg-dandiya-gold hover:bg-dandiya-gold-light rounded-lg shadow-sm transition-all"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
