import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskUTR(utr: string): string {
  if (!utr) return "••••••••";
  const clean = utr.trim();
  if (clean.length <= 4) return "••••" + clean;
  const suffix = clean.slice(-4);
  return "•".repeat(Math.max(4, clean.length - 4)) + suffix;
}

export function generateRequestId(): string {
  // Generate a distinct human-readable format e.g. DN-10482
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `DN-${randomNum}`;
}

export function normalizeUTR(utr: string): string {
  return utr.trim().replace(/\s+/g, "").toUpperCase();
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
