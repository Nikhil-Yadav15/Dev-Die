import React, { useContext } from "react";
import "boxicons/css/boxicons.min.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  return (
    <main
      className="relative flex flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)]
      px-4 sm:px-8 lg:px-16"
    >
      {/* Left: Text Content */}
      <div
        data-aos="fade-right"
        className="flex-1 z-20 mt-24 lg:mt-0"
      >
        {/* Badge */}
        <div
          className="relative inline-flex items-center justify-center px-6 py-2 text-xs sm:text-sm font-semibold tracking-wider
          bg-white/5 backdrop-blur-xl border border-white/15 rounded-full text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.06)]"
        >
          <i className="bx bx-capsule mr-2 text-gray-300"></i>
          INTRODUCING MEDICO
        </div>

        {/* Heading */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
          font-bold tracking-wide my-8 leading-tight text-gray-100"
        >
          Medicine Reminders.
          <br />
          Wellness Engineered.
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
          Medico keeps you and your care team in sync with smart medication
          schedules, adherence tracking, and clear insights—designed for serious
          health routines, not just simple reminders.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 mt-10">
          {/* Primary button */}
          <button
            onClick={handleGetStartedClick}
            className="px-8 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wider
            bg-gradient-to-r from-[#0f172a] to-[#1e293b]
            text-white
            border border-gray-700
            hover:from-[#1e293b] hover:to-[#0f172a]
            hover:text-white
            shadow-[0_0_12px_rgba(34,197,94,0.15)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]
            transition-all duration-300"
          >
            Get Started
            <i className="bx bx-chevron-right ml-1"></i>
          </button>

          {/* Secondary button */}
          <button
            onClick={handleDocumentationClick}
            className="px-8 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wider
            text-black border border-gray-600
            hover:text-white
            hover:border-[#38bdf8]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]
            transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right: Feature Cards */}
      <div
        data-aos="fade-left"
        className="flex-1 z-10 mt-16 lg:mt-0 lg:ml-10 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* Card 1 */}
          <div
            className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl 
            p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/40 mr-3">
                <i className="bx bx-bell text-emerald-400 text-xl"></i>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-100">
                Smart Dose Reminders
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Set precise medication schedules with repeat patterns, time zones,
              and snooze options tailored to complex treatment plans.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl 
            p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500/10 border border-sky-500/40 mr-3">
                <i className="bx bx-pulse text-sky-400 text-xl"></i>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-100">
                Adherence Insights
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Visualize missed doses, streaks, and adherence trends to support
              better clinical decisions and patient outcomes.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl 
            p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/40 mr-3">
                <i className="bx bx-user-check text-indigo-400 text-xl"></i>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-100">
                Patient & Caregiver Mode
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Designed for individuals, families, and caregivers to coordinate
              reminders and track medication together.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl 
            p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] h-full"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/10 border border-teal-500/40 mr-3">
                <i className="bx bx-shield-plus text-teal-400 text-xl"></i>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-100">
                Secure by Design
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Built with secure sessions, role-based access, and privacy-first
              patterns to respect sensitive health data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
