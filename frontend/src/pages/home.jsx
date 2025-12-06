import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Header from "../pages/header";
import { AuthContext } from "../contexts/AuthContext";

// Section wrapper with fade-in animation on scroll
function AnimatedSection({ children, id, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("idle");

  // Support form state
  const [supportForm, setSupportForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [supportStatus, setSupportStatus] = useState("idle");

  // Handle hash navigation on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactStatus("sending");
    setTimeout(() => {
      setContactStatus("success");
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setContactStatus("idle"), 3000);
    }, 2000);
  };

  const handleSupportChange = (e) => {
    setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportStatus("sending");
    setTimeout(() => {
      setSupportStatus("success");
      setSupportForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSupportStatus("idle"), 3000);
    }, 2000);
  };

  const handleDocumentationClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/documentation");
    }
  };

  const handleGetStartedClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/dashboard");
    }
  };

  const team = [
    {
      name: "Shubhankit Pathak",
      role: "Frontend & AI Chatbot Experience",
      description:
        "Crafts intuitive interfaces and conversational flows, ensuring Medico feels clear, friendly, and effortless for every user.",
    },
    {
      name: "Pranay Mathurkar",
      role: "Backend, API & Database",
      description:
        "Responsible for secure API design, data models, and backend services that deliver reliable health-critical operations.",
    },
    {
      name: "Nikhil Yadav",
      role: "Generative AI & Health Insights",
      description:
        "Builds AI systems that help Medico provide smart suggestions, safety guidance, and personalized support.",
    },
  ];

  return (
    <main
      className="relative min-h-screen text-slate-50"
      style={{
        background:
          "radial-gradient(circle at 90% 10%, rgba(14,165,233,0.08) 0%, rgba(2,6,23,1) 35%, rgba(0,0,0,1) 90%)",
      }}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full border border-cyan-400/10 opacity-20 blur-sm" />
      <div className="pointer-events-none absolute -left-32 bottom-[-8rem] h-96 w-96 rounded-full border border-emerald-400/10 opacity-10 blur-sm" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, rgba(30,58,138,0.18) 0, transparent 60%), radial-gradient(circle at 10% 90%, rgba(6,78,59,0.12) 0, transparent 55%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Hero Section */}
      <AnimatedSection id="hero">
        <div className="relative flex flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)] px-4 sm:px-8 lg:px-16">
          {/* Left: Text Content */}
          <div className="flex-1 z-20 mt-24 lg:mt-0">
            <div className="relative inline-flex items-center justify-center px-6 py-2 text-xs sm:text-sm font-semibold tracking-wider bg-white/5 backdrop-blur-xl border border-white/15 rounded-full text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.06)]">
              <i className="bx bx-capsule mr-2 text-gray-300"></i>
              INTRODUCING MEDICO
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide my-8 leading-tight text-gray-100">
              Medicine Reminders.
              <br />
              Wellness Engineered.
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
              Medico keeps you and your care team in sync with smart medication
              schedules, adherence tracking, and clear insights—designed for serious
              health routines, not just simple reminders.
            </p>

            <div className="flex gap-4 mt-10">
              <button
                onClick={handleGetStartedClick}
                className="px-8 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wider bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white border border-gray-700 hover:from-[#1e293b] hover:to-[#0f172a] hover:text-white shadow-[0_0_12px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all duration-300"
              >
                Get Started
                <i className="bx bx-chevron-right ml-1"></i>
              </button>

              <button
                onClick={handleDocumentationClick}
                className="px-8 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wider text-black border border-gray-600 hover:text-white hover:border-[#38bdf8] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="flex-1 z-10 mt-16 lg:mt-0 lg:ml-10 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/40 mr-3">
                    <i className="bx bx-bell text-emerald-400 text-xl"></i>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-100">Smart Dose Reminders</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Set precise medication schedules with repeat patterns, time zones, and snooze options tailored to complex treatment plans.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500/10 border border-sky-500/40 mr-3">
                    <i className="bx bx-pulse text-sky-400 text-xl"></i>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-100">Adherence Insights</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Visualize missed doses, streaks, and adherence trends to support better clinical decisions and patient outcomes.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/40 mr-3">
                    <i className="bx bx-user-check text-indigo-400 text-xl"></i>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-100">Patient & Caregiver Mode</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Designed for individuals, families, and caregivers to coordinate reminders and track medication together.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/10 border border-teal-500/40 mr-3">
                    <i className="bx bx-shield-plus text-teal-400 text-xl"></i>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-100">Secure by Design</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Built with secure sessions, role-based access, and privacy-first patterns to respect sensitive health data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-wide mb-12 text-center">
            About Medico
          </h2>

          <div className="max-w-4xl mx-auto bg-white/[0.04] backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 mb-20">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Medico is a focused health-support platform that simplifies medication
              routines, improves adherence, and strengthens the connection between
              patients and caregivers.
            </p>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6">
              By combining clinical reliability with clear design, we help users stay
              consistent with their treatments while maintaining control of their data.
            </p>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Our mission: everyday health management that feels modern, supportive,
              and dependable — never overwhelming.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.04)] text-center hover:shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-gray-300 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection id="contact" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-4 text-center">
            Contact Medico
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto text-sm md:text-base">
            Have a question, feedback, or a feature request? Send us a message
            and we'll get back to you as soon as we can.
          </p>

          <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl p-6 md:p-8">
            {contactStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full border border-emerald-400/60 flex items-center justify-center">
                  <span className="text-emerald-400 text-xl">✓</span>
                </div>
                <p className="text-sm md:text-base text-emerald-300 font-medium">
                  Thank you! Your message has been sent successfully.
                </p>
              </div>
            ) : contactStatus === "sending" ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm md:text-base text-gray-300">Sending your message…</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Name</label>
                  <input
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Enter your full name"
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="you@example.com"
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm md:text-base font-semibold tracking-wide bg-gradient-to-r from-[#0f172a] to-[#1f2937] text-white border border-gray-700 hover:from-[#111827] hover:to-[#020617] hover:border-gray-400 shadow-[0_0_18px_rgba(0,0,0,0.9)] transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Support Section */}
      <AnimatedSection id="support" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-4 text-center">
            Medico Support
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto text-sm md:text-base">
            Experiencing an issue or need help using Medico? Share the details
            below and our team will review your request.
          </p>

          <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl p-6 md:p-8">
            {supportStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full border border-emerald-400/60 flex items-center justify-center">
                  <span className="text-emerald-400 text-xl">✓</span>
                </div>
                <p className="text-sm md:text-base text-emerald-300 font-medium">
                  Thank you! Your support request has been received.
                </p>
              </div>
            ) : supportStatus === "sending" ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm md:text-base text-gray-300">Submitting your request…</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Name</label>
                  <input
                    name="name"
                    value={supportForm.name}
                    onChange={handleSupportChange}
                    placeholder="Enter your full name"
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={supportForm.email}
                    onChange={handleSupportChange}
                    placeholder="you@example.com"
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Subject</label>
                  <input
                    name="subject"
                    value={supportForm.subject}
                    onChange={handleSupportChange}
                    placeholder="Brief summary of your issue"
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs md:text-sm text-gray-300">Message</label>
                  <textarea
                    name="message"
                    value={supportForm.message}
                    onChange={handleSupportChange}
                    placeholder="Describe the issue, steps to reproduce, and any relevant details."
                    rows={5}
                    required
                    className="px-3 py-2 rounded-lg bg-black/40 text-gray-100 placeholder-gray-500 border border-gray-700/70 focus:border-gray-300 focus:outline-none focus:ring-0 text-sm md:text-base resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm md:text-base font-semibold tracking-wide bg-gradient-to-r from-[#0f172a] to-[#1f2937] text-white border border-gray-700 hover:from-[#111827] hover:to-[#020617] hover:border-gray-400 shadow-[0_0_18px_rgba(0,0,0,0.9)] transition-all duration-300"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>

          <footer className="mt-10 text-center text-gray-500 text-xs md:text-sm">
            © {new Date().getFullYear()} Medico · Support is not a substitute for emergency medical services.
          </footer>
        </div>
      </AnimatedSection>
    </main>
  );
}
