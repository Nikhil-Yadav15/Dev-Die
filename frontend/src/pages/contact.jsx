import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    }, 2000);
  }

  return (
    <div
      className="min-h-screen text-gray-100 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 85% 10%, rgba(148,163,184,0.20) 0, rgba(0,0,0,1) 55%)",
      }}
    >
      {/* Subtle glow layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 90%, rgba(148,163,184,0.12) 0, transparent 55%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            Contact Medico
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Have a question, feedback, or a feature request? Send us a message
            and we’ll get back to you as soon as we can.
          </p>
        </header>

        {/* Card */}
        <main
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl
          shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl p-6 md:p-8"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border border-emerald-400/60 flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
              <p className="text-sm md:text-base text-emerald-300 font-medium">
                Thank you! Your message has been sent successfully.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-xs md:text-sm text-gray-300 underline underline-offset-4 hover:text-white transition"
              >
                Send another message
              </button>
            </div>
          ) : status === "sending" ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm md:text-base text-gray-300">
                Sending your message…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm text-gray-300">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 
                  placeholder-gray-500 border border-gray-700/70
                  focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm text-gray-300">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 
                  placeholder-gray-500 border border-gray-700/70
                  focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm text-gray-300">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 
                  placeholder-gray-500 border border-gray-700/70
                  focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center px-6 py-2.5
                rounded-full text-sm md:text-base font-semibold tracking-wide
                bg-gradient-to-r from-[#0f172a] to-[#1f2937]
                text-white border border-gray-700
                hover:from-[#111827] hover:to-[#020617]
                hover:border-gray-400
                shadow-[0_0_18px_rgba(0,0,0,0.9)]
                transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500 text-xs md:text-sm">
          © {new Date().getFullYear()} Medico · Contact support for
          health-related questions, not emergency care.
        </footer>
      </div>
    </div>
  );
}
