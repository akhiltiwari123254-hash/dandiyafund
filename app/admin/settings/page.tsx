"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  QrCode,
  MessageCircle,
  Building,
  Calendar,
  IndianRupee,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [adminWhatsApp, setAdminWhatsApp] = useState("");
  const [adminDisplayName, setAdminDisplayName] = useState("");
  const [minAmount, setMinAmount] = useState(100);
  const [maxAmount, setMaxAmount] = useState(10000);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setEventName(s.eventName || "");
          setEventDate(s.eventDate || "");
          setEventVenue(s.eventVenue || "");
          setEventDescription(s.eventDescription || "");
          setUpiId(s.upiId || "");
          setQrCodeUrl(s.qrCodeUrl || "");
          setAdminWhatsApp(s.adminWhatsApp || "");
          setAdminDisplayName(s.adminDisplayName || "");
          setMinAmount(s.minAmount || 100);
          setMaxAmount(s.maxAmount || 10000);
        }
      } catch {
        setError("Failed to fetch event settings.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventDate,
          eventVenue,
          eventDescription,
          upiId,
          qrCodeUrl: qrCodeUrl || null,
          adminWhatsApp,
          adminDisplayName,
          minAmount: Number(minAmount),
          maxAmount: Number(maxAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update settings.");
      } else {
        setSuccess("Event settings updated successfully! Changes are live across the portal.");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch {
      setError("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-dandiya-gold">
        Loading configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-widest text-dandiya-gold font-bold">
          Portal Customization
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dandiya-gold-light">
          Event & UPI Settings
        </h1>
        <p className="text-xs text-dandiya-ivory/60 mt-1">
          Update event details, UPI QR information, and WhatsApp numbers without changing any source code.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Event Identity */}
        <div className="p-6 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold space-y-4">
          <h2 className="text-sm font-serif font-bold text-dandiya-gold border-b border-dandiya-border/40 pb-2">
            1. Event Information & Venue
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Event Name
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Event Date & Time
              </label>
              <input
                type="text"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="e.g. October 18, 2026 • 6:30 PM Onwards"
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Venue Location
              </label>
              <input
                type="text"
                required
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                placeholder="e.g. University Grand Amphitheater & Lawns"
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Event Description
              </label>
              <textarea
                rows={2}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: UPI & Banking Config */}
        <div className="p-6 rounded-2xl bg-[#1C0A19] border border-dandiya-border shadow-gold space-y-4">
          <h2 className="text-sm font-serif font-bold text-dandiya-gold border-b border-dandiya-border/40 pb-2">
            2. Payment & WhatsApp Notifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Payee UPI ID (For dynamic QR)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. dandiyanight2026@upi"
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory font-mono text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Admin WhatsApp Notification Number
              </label>
              <input
                type="text"
                required
                value={adminWhatsApp}
                onChange={(e) => setAdminWhatsApp(e.target.value)}
                placeholder="e.g. 918651879192"
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory font-mono text-xs focus:border-dandiya-gold focus:outline-none"
              />
              <span className="text-[10px] text-dandiya-ivory/50 mt-1 block">
                Include country code (e.g. 91 for India). Used for direct WhatsApp receipt messaging.
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                Organizing Entity Name
              </label>
              <input
                type="text"
                required
                value={adminDisplayName}
                onChange={(e) => setAdminDisplayName(e.target.value)}
                placeholder="e.g. Dandiya Organizing Committee"
                className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                  Min Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-dandiya-gold/80 font-bold mb-1">
                  Max Amount (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#120510] border border-dandiya-border rounded-xl text-dandiya-ivory text-xs focus:border-dandiya-gold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-dandiya-wine bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 shadow-gold"
        >
          {saving ? (
            <span>Saving settings...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Event Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
