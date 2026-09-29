"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, X } from "lucide-react";

interface DandiyaOpeningAnimationProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export default function DandiyaOpeningAnimation({
  onComplete,
  forcePlay = false,
}: DandiyaOpeningAnimationProps) {
  const [stage, setStage] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check session storage if already viewed
    const hasViewed = sessionStorage.getItem("dandiya_intro_viewed_v1");

    if ((hasViewed && !forcePlay) || prefersReducedMotion) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Sequence timing
    const t1 = setTimeout(() => setStage(1), 300); // Dancers enter
    const t2 = setTimeout(() => setStage(2), 1600); // Sticks clash / spark burst
    const t3 = setTimeout(() => setStage(3), 2600); // Festive bloom & text
    const t4 = setTimeout(() => {
      setStage(4); // Fade out
      sessionStorage.setItem("dandiya_intro_viewed_v1", "true");
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 700);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [forcePlay, onComplete]);

  // Particle background effect on canvas
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      life: number;
    }> = [];

    const colors = ["#D4AF37", "#FF7A18", "#E65C00", "#F3E5AB", "#FF4500"];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.5 - 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        life: Math.random() * 100,
      });
    }

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.5;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.sin(p.life * 0.05) * 0.5 + 0.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [visible]);

  if (!visible) return null;

  const handleSkip = () => {
    sessionStorage.setItem("dandiya_intro_viewed_v1", "true");
    setVisible(false);
    onComplete?.();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#120510] transition-opacity duration-700 select-none ${
        stage === 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Background Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#781D39]/30 via-[#3D0C22]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E65C00]/15 blur-2xl pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-dandiya-gold bg-dandiya-wine-light/80 hover:bg-dandiya-wine border border-dandiya-border rounded-full backdrop-blur-md transition-all shadow-gold"
      >
        <span>Skip</span>
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-4 py-12">
        {/* Animated Cultural Dandiya Couple Interaction */}
        <div className="relative w-80 h-72 sm:w-96 sm:h-80 flex items-center justify-center">
          {/* Central Radiance / Rangoli Mandala (Appears on Clash) */}
          <div
            className={`absolute transition-all duration-700 pointer-events-none flex items-center justify-center ${
              stage >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {/* Intricate Geometric Rangoli SVG */}
            <svg
              className="w-72 h-72 sm:w-88 sm:h-88 animate-[spin_30s_linear_infinite] opacity-60 text-dandiya-gold"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="100" cy="100" r="90" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="75" strokeWidth="1" />
              <circle cx="100" cy="100" r="50" strokeWidth="1.2" />
              {/* Petals */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <path
                  key={deg}
                  d="M100 100 Q100 20 115 50 T100 100"
                  strokeWidth="0.8"
                  transform={`rotate(${deg} 100 100)`}
                  fill="rgba(212,175,55,0.04)"
                />
              ))}
              <circle cx="100" cy="100" r="16" fill="rgba(230,92,0,0.25)" />
            </svg>

            {/* Spark Contact Starburst */}
            <div
              className={`absolute w-20 h-20 bg-gradient-radial from-[#FFFDF9] via-[#FFD700] to-transparent rounded-full blur-[2px] transition-transform duration-300 ${
                stage === 2 ? "scale-150 opacity-100" : "scale-100 opacity-30"
              }`}
            />
          </div>

          {/* Left Character (Male Dancer in Stylized Traditional Attire with Dandiya Stick) */}
          <div
            className={`absolute left-4 sm:left-10 bottom-6 transition-all duration-1000 ease-out transform ${
              stage >= 1 ? "translate-x-6 sm:translate-x-12 opacity-100" : "-translate-x-16 opacity-0"
            }`}
          >
            <div className="relative w-32 h-56 sm:w-36 sm:h-64 flex flex-col items-center">
              {/* Stylized Cultural Character SVG */}
              <svg viewBox="0 0 100 180" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="kediyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A1838" />
                    <stop offset="100%" stopColor="#4A0E22" />
                  </linearGradient>
                  <linearGradient id="stickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F3E5AB" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#AA820A" />
                  </linearGradient>
                </defs>

                {/* Turban / Paghdi */}
                <path d="M40 25 Q50 12 65 24 Q72 32 60 38 Q45 40 40 25 Z" fill="#E65C00" />
                <path d="M48 20 Q56 16 62 22" stroke="#D4AF37" strokeWidth="2" fill="none" />
                
                {/* Face Silhouette */}
                <circle cx="53" cy="40" r="10" fill="#E0A97E" />

                {/* Kurta / Kediya Torso */}
                <path d="M38 52 Q53 48 68 52 L75 92 Q53 98 31 92 Z" fill="url(#kediyaGrad)" />
                {/* Traditional Mirror / Gold Embroidered Border */}
                <path d="M45 52 L53 85 L61 52" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
                <path d="M31 92 Q53 98 75 92" stroke="#E65C00" strokeWidth="2.5" fill="none" />

                {/* Dhoti / Pants */}
                <path d="M34 92 L30 150 Q48 152 50 115 Q52 152 70 150 L66 92 Z" fill="#FDFBF7" opacity="0.9" />

                {/* Left Arm holding Dandiya Stick angled towards center */}
                <path d="M62 60 Q78 68 85 82" stroke="#E0A97E" strokeWidth="5" strokeLinecap="round" fill="none" />
                {/* Dandiya Stick */}
                <line
                  x1="76"
                  y1="94"
                  x2="108"
                  y2="55"
                  stroke="url(#stickGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className={`transition-transform origin-[76px_94px] duration-500 ${
                    stage >= 2 ? "rotate-6" : "-rotate-6"
                  }`}
                />
              </svg>
            </div>
          </div>

          {/* Right Character (Female Dancer in Stylized Traditional Chaniya Choli with Dandiya Stick) */}
          <div
            className={`absolute right-4 sm:right-10 bottom-6 transition-all duration-1000 ease-out transform ${
              stage >= 1 ? "-translate-x-6 sm:-translate-x-12 opacity-100" : "translate-x-16 opacity-0"
            }`}
          >
            <div className="relative w-32 h-56 sm:w-36 sm:h-64 flex flex-col items-center">
              {/* Stylized Cultural Character SVG */}
              <svg viewBox="0 0 100 180" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="choliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C94A00" />
                    <stop offset="100%" stopColor="#781D39" />
                  </linearGradient>
                  <linearGradient id="ghagraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#55122B" />
                    <stop offset="100%" stopColor="#2D0817" />
                  </linearGradient>
                </defs>

                {/* Hair Bun with Gajra / Maang Tikka */}
                <circle cx="48" cy="30" r="11" fill="#1C0B18" />
                <path d="M40 28 Q48 18 56 28" stroke="#FDFBF7" strokeWidth="3" fill="none" />
                {/* Face Silhouette */}
                <circle cx="48" cy="40" r="9" fill="#E8B48D" />
                <circle cx="48" cy="35" r="1.5" fill="#D4AF37" /> {/* Bindi/Tikka */}

                {/* Choli Torso */}
                <path d="M36 50 Q48 47 60 50 L64 74 Q48 77 32 74 Z" fill="url(#choliGrad)" />
                {/* Dupatta drape */}
                <path d="M34 52 Q24 90 28 140 Q40 145 42 100" fill="rgba(230,92,0,0.4)" />

                {/* Flared Ghagra / Chaniya Skirt */}
                <path d="M34 76 Q48 78 62 76 L82 155 Q48 165 14 155 Z" fill="url(#ghagraGrad)" />
                {/* Embroidered Hem Borders */}
                <path d="M16 153 Q48 163 80 153" stroke="#D4AF37" strokeWidth="3" fill="none" />
                <path d="M19 146 Q48 156 77 146" stroke="#E65C00" strokeWidth="2" fill="none" />

                {/* Right Arm holding Dandiya Stick angled towards center */}
                <path d="M36 58 Q22 66 16 80" stroke="#E8B48D" strokeWidth="5" strokeLinecap="round" fill="none" />
                {/* Dandiya Stick */}
                <line
                  x1="24"
                  y1="92"
                  x2="-8"
                  y2="53"
                  stroke="url(#stickGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className={`transition-transform origin-[24px_92px] duration-500 ${
                    stage >= 2 ? "-rotate-6" : "rotate-6"
                  }`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title and Cultural Elevation Bloom */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ease-out transform ${
            stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 text-dandiya-gold tracking-[0.3em] uppercase text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron-light animate-spin" />
            <span>Official College Celebration</span>
            <Sparkles className="w-3.5 h-3.5 text-dandiya-saffron-light animate-spin" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-dandiya-gold-light via-dandiya-gold to-dandiya-saffron-light tracking-wide drop-shadow-md">
            DANDIYA NIGHT 2026
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-dandiya-ivory/80 tracking-widest font-light">
            उत्सवः नृत्यस्य • उत्सवः आनन्दस्य • Celebrate Rhythm & Community
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-dandiya-gold" />
            <span className="w-2 h-2 rotate-45 border border-dandiya-gold bg-dandiya-saffron" />
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-dandiya-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}
