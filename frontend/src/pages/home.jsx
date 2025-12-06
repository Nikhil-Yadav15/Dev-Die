import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Header from "../pages/header";
import Hero from "../pages/hero";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden text-slate-50"
      style={{
        background:
          "radial-gradient(circle at 90% 10%, rgba(14,165,233,0.08) 0%, rgba(2,6,23,1) 35%, rgba(0,0,0,1) 90%)",
      }}
    >
      {/* Subtle orbits — darker + softer */}
      <div
        className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full 
        border border-cyan-400/10 opacity-20 blur-sm"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-[-8rem] h-96 w-96 rounded-full 
        border border-emerald-400/10 opacity-10 blur-sm"
      />

      {/* Gentle background glow — less aggressive */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, rgba(30,58,138,0.18) 0, transparent 60%), radial-gradient(circle at 10% 90%, rgba(6,78,59,0.12) 0, transparent 55%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
      </div>
    </main>
  );
}
