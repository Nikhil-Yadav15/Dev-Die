import { motion } from "framer-motion";

export default function About() {
  const team = [
    {
      name: "Shubhankit Pathak",
      role: "Frontend & Chatbot",
      description: "B.Tech 2nd Year student, worked on Chatbot and Frontend",
    },
    {
      name: "Pranay Mathurkar",
      role: "Team Leader | Backend Developer",
      description: "B.Tech 2nd Year student, handled backend architecture and API design",
    },
    {
      name: "Samarth Bose",
      role: "Frontend Developer",
      description: "B.Tech 2nd Year student, worked on frontend components and UI/UX",
    },
  ];

  return (
    <section className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
    
      <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-black blur-3xl pointer-events-none"></div>

    
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-[0_0_25px_rgba(255,215,0,0.4)] mb-10 text-center"
      >
        About Us
      </motion.h1>

     
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl bg-gradient-to-br from-zinc-900/60 to-black/80 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.15)] border border-yellow-400/20 mb-16"
      >
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
          <span className="text-yellow-400 font-semibold">Medico</span> — an innovative wellness platform 
          created by <span className="text-yellow-500">Team Codeburners</span>. It transforms health management 
          into a seamless, empowering experience.
        </p>

        <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6">
          Inspired by the art of alchemy, Medico blends technology and care to help users manage medications, 
          track wellness, and maintain balance in everyday life.
        </p>

        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
          Our goal: redefine healthcare through elegance, innovation, and empathy. With a sleek golden interface, 
          Medico turns daily routines into acts of mindful self-care.
        </p>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-4xl w-full grid md:grid-cols-3 gap-8 mb-16"
      >
        {team.map((member) => (
          <div
            key={member.name}
            className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-yellow-400/20 shadow-[0_0_20px_rgba(255,215,0,0.15)] text-center"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-1">{member.name}</h3>
            <p className="text-yellow-300 italic mb-2">{member.role}</p>
            <p className="text-gray-300 text-sm">{member.description}</p>
          </div>
        ))}
      </motion.div>

     
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-4 text-yellow-500 text-lg italic tracking-wide text-center max-w-2xl"
      >
        “Where wellness meets alchemy.”
      </motion.p>
    </section>
  );
}
