import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: "Dandiya Night 2026 • Official College Fund Management Portal",
  description:
    "Official, secure, and transparent fund management platform for the annual college Dandiya Night 2026 celebration. Voluntary student contributions verified by the organizing committee.",
  keywords: [
    "Dandiya Night 2026",
    "College Dandiya",
    "Garba Festival Fund",
    "Student Cultural Event",
    "UPI Contribution Portal",
  ],
  authors: [{ name: "Dandiya Organizing Committee" }],
  openGraph: {
    title: "Dandiya Night 2026 • Official Fund Management Portal",
    description:
      "Contribute voluntarily, scan event UPI QR, and verify payment status transparently.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#120510] text-[#FDFBF7] antialiased selection:bg-dandiya-gold selection:text-dandiya-wine font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
