import React from "react";

export default function Hero({ onStart }: { onStart?: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0a0a0f] via-[#10111a] to-[#1a1b2e] text-white relative overflow-hidden">
      {/* NavBar Placeholder */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-lg" />
          <span className="font-bold text-xl tracking-tight">hireai</span>
        </div>
        <div className="flex gap-8 text-gray-300 font-medium">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#solution" className="hover:text-white">Solution</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white font-semibold hover:bg-white/20 transition">Login</button>
          <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">Login</button>
        </div>
      </div>
      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 pt-32 pb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 drop-shadow-xl">
          AI-Powered Hiring, <br />Reimagined for Modern Teams
        </h1>
        <p className="text-xl md:text-2xl text-center text-gray-200 mb-10 max-w-2xl">
          Instantly analyze, score, and shortlist candidates with transparency and trust. <br />
          Elevate your recruitment with beautiful dashboards, smart search, and actionable insights.
        </p>
        <button
          className="mt-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg shadow-lg hover:bg-gray-200 transition"
          onClick={onStart}
        >
          Get Started
        </button>
      </div>
      {/* Tilted Screenshot Preview */}
      <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-1/3 w-[900px] max-w-[90vw] h-[400px] pointer-events-none z-0">
        <div className="w-full h-full rounded-3xl shadow-2xl border border-white/10 overflow-hidden rotate-[-12deg] blur-[2px] opacity-80 flex items-center justify-center bg-black/40">
          <img
            src="/dashboard-preview.png"
            alt="Dashboard Preview"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'blur(2px) brightness(0.7)' }}
          />
        </div>
      </div>
    </div>
  );
} 