"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Shield, Menu, X, HeartHandshake, Search } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin dashboard, keep public navbar hidden or minimal
  const isAdminRoute = pathname?.startsWith("/admin");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Contribute", href: "/contribute" },
    { label: "Check Status", href: "/status" },
    { label: "Event Guidelines", href: "/#guidelines" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120510]/85 backdrop-blur-md border-b border-dandiya-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-dandiya-maroon via-dandiya-crimson to-dandiya-wine flex items-center justify-center border border-dandiya-border shadow-gold group-hover:border-dandiya-gold transition-all">
            {/* Cultural Diya & Crossed Dandiya Sticks SVG */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-dandiya-gold" fill="none" stroke="currentColor">
              <path d="M4 20L20 4" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M20 20L4 4" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.5" fill="#E65C00" stroke="#FFD700" strokeWidth="1" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-dandiya-saffron animate-ping" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron-light">
              DANDIYA NIGHT
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-dandiya-gold/70 font-medium">
              2026 • Fund Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-dandiya-gold bg-dandiya-wine border border-dandiya-border shadow-sm"
                    : "text-dandiya-ivory/80 hover:text-dandiya-gold hover:bg-dandiya-wine/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/status"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-dandiya-gold hover:text-dandiya-gold-light border border-dandiya-border/80 hover:border-dandiya-gold rounded-full transition-all"
          >
            <Search className="w-3.5 h-3.5 text-dandiya-saffron" />
            <span>Verify Status</span>
          </Link>

          <Link
            href="/contribute"
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron rounded-full shadow-gold hover:shadow-gold-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Contribute</span>
          </Link>

          <Link
            href="/admin/login"
            title="Administrator Portal"
            className="p-2 text-dandiya-ivory/50 hover:text-dandiya-gold hover:bg-dandiya-wine/50 rounded-lg border border-transparent hover:border-dandiya-border transition-all"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/contribute"
            className="px-3 py-1.5 text-xs font-bold text-dandiya-wine bg-dandiya-gold rounded-full"
          >
            Contribute
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-dandiya-gold rounded-lg hover:bg-dandiya-wine focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#180715] border-b border-dandiya-border px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-dandiya-ivory/90 hover:text-dandiya-gold rounded-lg hover:bg-dandiya-wine/60"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-dandiya-border/50 flex flex-col gap-2">
            <Link
              href="/status"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-dandiya-gold"
            >
              <Search className="w-4 h-4 text-dandiya-saffron" />
              <span>Check Payment Status</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-dandiya-ivory/60 hover:text-dandiya-gold"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
