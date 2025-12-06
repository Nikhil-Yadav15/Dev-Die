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
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#1a1a1a] text-gray-100 flex flex-col items-center py-12 px-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          Contact Medico
        </h1>
        <p className="text-gray-400 mt-3 max-w-md mx-auto">
          We'd love to hear from you. Send us your thoughts or feedback below.
        </p>
      </header>

      <main className="w-full max-w-md bg-black/60 p-8 rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.15)] border border-[#d4af37]/20 transition-all duration-300 hover:shadow-[0_0_35px_rgba(212,175,55,0.3)]">
        {status === "success" ? (
          <div className="text-center text-[#d4af37] font-semibold animate-fade-in">
            ✨ Thank you! Your message has been sent successfully.
          </div>
        ) : status === "sending" ? (
          <div className="flex flex-col items-center justify-center text-[#ffd873] font-medium">
            <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3"></div>
            Sending your message...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="px-3 py-2 rounded-md bg-black/40 placeholder-gray-400 ring-1 ring-[#d4af37]/20 focus:ring-[#d4af37]/40 focus:outline-none"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="px-3 py-2 rounded-md bg-black/40 placeholder-gray-400 ring-1 ring-[#d4af37]/20 focus:ring-[#d4af37]/40 focus:outline-none"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              required
              className="px-3 py-2 rounded-md bg-black/40 placeholder-gray-400 ring-1 ring-[#d4af37]/20 focus:ring-[#d4af37]/40 focus:outline-none"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-[#d4af37] text-black font-semibold rounded-lg shadow-inner hover:bg-[#ffd873] transition"
            >
              Send Message
            </button>
          </form>
        )}
      </main>

      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Medico
      </footer>
    </div>
  );
}
