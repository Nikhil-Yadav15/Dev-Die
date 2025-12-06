import { motion } from "framer-motion";

export default function About() {
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
    <section
      className="min-h-screen text-gray-200 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 90% 10%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, rgba(255,255,255,0.08) 0, transparent 60%)",
        }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold text-white tracking-wide mb-12 text-center"
      >
        About Medico
      </motion.h1>

      {/* Overview Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl bg-white/[0.04] backdrop-blur-xl p-8 md:p-12 rounded-2xl 
        shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 mb-20 relative z-10"
      >
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
      </motion.div>

      {/* Team Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
      >
        {team.map((member) => (
          <div
            key={member.name}
            className="bg-white/[0.04] backdrop-blur-xl p-6 rounded-2xl
            border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.04)]
            text-center hover:shadow-[0_0_35px_rgba(255,255,255,0.12)]
            transition-all"
          >
            <h3 className="text-lg font-semibold text-white mb-1">
              {member.name}
            </h3>
            <p className="text-gray-300 text-sm font-medium mb-3">
              {member.role}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {member.description}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Tag line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-12 text-gray-200 text-base md:text-lg tracking-wide text-center max-w-xl relative z-10"
      >
        Built with precision. Designed with care.
      </motion.p>
    </section>
  );
}
