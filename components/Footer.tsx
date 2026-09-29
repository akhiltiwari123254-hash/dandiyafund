import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-dandiya-border bg-[#0E030C] text-dandiya-ivory/70">
      {/* Decorative Traditional Border Motif */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-dandiya-gold to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Cultural Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-dandiya-saffron" />
              <h3 className="font-serif font-bold text-lg text-dandiya-gold tracking-wide">
                DANDIYA NIGHT 2026
              </h3>
            </div>
            <p className="text-sm text-dandiya-ivory/70 max-w-md leading-relaxed">
              Official student voluntary fund management platform for the annual college Dandiya & Garba celebration. Built with transparency, security, and student privacy at its core.
            </p>
            <div className="flex items-center gap-2 text-xs text-dandiya-gold/80 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron" />
              <span>Organized with pride by the Student Cultural Council</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-dandiya-gold transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-dandiya-gold transition-colors">
                  Contribute via UPI
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-dandiya-gold transition-colors">
                  Track Payment Status
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-dandiya-gold transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-dandiya-gold" />
                  <span>Admin Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-dandiya-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-dandiya-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <span className="text-xs text-dandiya-ivory/50 block pt-1">
                  Manual Bank UTR verification protects every single student rupee.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dandiya-border/30 flex flex-col sm:flex-row items-center justify-between text-xs text-dandiya-ivory/50 gap-4">
          <p>© 2026 Dandiya Night Organizing Committee. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-dandiya-crimson fill-dandiya-crimson" />
            <span>for the college student community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
