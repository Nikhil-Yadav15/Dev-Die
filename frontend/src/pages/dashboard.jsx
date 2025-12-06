import ChatbotWidget from "../components/ChatbotWidget.jsx";
import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Menu, X, CheckCircle, Clock, XCircle } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import WeeklyProgressChart from "../components/GraphCard";

const getPercent = (onTime, late, missed, total) =>
  total === 0 ? 0 : Math.round(((onTime + late * 0.5) / total) * 100);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { user, trackIntake } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDoses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://medico-backend-hjxm.onrender.com/medicine/today?token=${token}`
      );
      const json = await res.json();
      setDoses(Array.isArray(json) ? json : []);
    } catch {
      setDoses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDoses();
      const intervalId = setInterval(fetchDoses, 60000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleIntake = async (medicineId, scheduledTime, markedStatus) => {
    try {
      const now = new Date();
      const scheduled = new Date(scheduledTime);
      const isLate =
        markedStatus === "taken" && now - scheduled > 60 * 60 * 1000;
      const sendStatus = isLate ? "late" : markedStatus;
      await trackIntake(medicineId, scheduledTime, sendStatus);
      await fetchDoses();
    } catch (e) {
      console.error("Track intake failed:", e);
    }
  };

  const getDisplayStatus = (dose) => {
    if (dose.log) {
      if (dose.log.status === "taken") return "taken";
      if (dose.log.status === "late") return "late";
      if (dose.log.status === "missed") return "missed";
    }
    const medTime = new Date(dose.scheduledTime);
    const diffMins = (now - medTime) / (1000 * 60);
    if (diffMins < 0) return "upcoming";
    return "due";
  };

  const sortedDoses = [...doses].sort(
    (a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)
  );

  const pastOrNow = sortedDoses.filter(
    (d) => new Date(d.scheduledTime) <= now
  );
  const onTime = pastOrNow.filter((d) => getDisplayStatus(d) === "taken").length;
  const late = pastOrNow.filter((d) => getDisplayStatus(d) === "late").length;
  const missed = pastOrNow.filter((d) => getDisplayStatus(d) === "missed")
    .length;
  const total = sortedDoses.length;
  const percent = getPercent(onTime, late, missed, total);

  const statusTheme = {
    taken:
      "bg-slate-950/80 border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    late:
      "bg-slate-950/80 border border-amber-300/60 shadow-[0_0_25px_rgba(252,211,77,0.25)]",
    missed:
      "bg-slate-950/80 border border-rose-400/60 shadow-[0_0_25px_rgba(248,113,113,0.3)]",
    due:
      "bg-slate-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(56,189,248,0.3)]",
    upcoming:
      "bg-slate-950/70 border border-slate-600/70 shadow-[0_0_20px_rgba(15,23,42,0.9)]",
  };

  return (
    <>
      <div
        className="flex min-h-screen text-gray-100 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 90% 10%, rgba(14,165,233,0.08) 0%, rgba(2,6,23,1) 35%, rgba(0,0,0,1) 90%)",
        }}
      >
        {/* subtle glow layers */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 15%, rgba(56,189,248,0.14) 0, transparent 60%), radial-gradient(circle at 10% 90%, rgba(34,197,94,0.10) 0, transparent 55%)",
          }}
        />

        {/* Sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 transition-opacity"
            />
            <div className="relative w-64 bg-slate-950/95 border-l border-cyan-400/30 p-4 shadow-2xl rounded-tr-3xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-cyan-200">
                  {user?.name || "User"}
                </span>
                <button
                  className="p-2 rounded-md hover:bg-slate-900 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-black-200" />
                </button>
              </div>
              <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-black/70 backdrop-blur-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-slate-900 bg-black transition"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-cyan-300" />
            </button>
            <div className="flex items-center gap-4">
              <Topbar />
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full
                text-sm font-semibold tracking-wide
                bg-gradient-to-r from-[#0f172a] to-[#1f2937]
                text-white border border-slate-600
                hover:from-[#111827] hover:to-[#020617]
                hover:border-cyan-400
                shadow-[0_0_18px_rgba(8,47,73,0.9)]
                transition-all duration-300"
              >
                Talk to Bot
              </button>
            </div>
          </div>

          <main className="p-6 lg:p-8 flex-1">
            <div className="max-w-6xl mx-auto">
              {/* Heading */}
              <header className="mb-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
                  Welcome back, {user?.name || "there"}
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Here’s a quick view of today’s medications and your current
                  adherence.
                </p>
              </header>

              {/* Main two-column layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* LEFT: Medicines */}
                <section className="xl:col-span-2">
                  <h3 className="text-lg md:text-xl text-gray-100 font-semibold mb-4">
                    Medicines To Take Today
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {loading ? (
                      <div className="col-span-1 md:col-span-2 text-cyan-200">
                        Loading…
                      </div>
                    ) : total === 0 ? (
                      <div className="col-span-1 md:col-span-2 bg-slate-950/80 border border-slate-700 px-6 sm:px-8 py-8 sm:py-10 text-gray-300 rounded-2xl shadow-[0_0_30px_rgba(15,23,42,1)] text-center">
                        No medicines scheduled for today.
                      </div>
                    ) : (
                      sortedDoses.map((dose) => {
                        const doseStatus = getDisplayStatus(dose);
                        const themeClass =
                          statusTheme[doseStatus] || statusTheme["due"];

                        const statusLabel =
                          doseStatus === "taken"
                            ? "Taken"
                            : doseStatus === "late"
                            ? "Taken Late"
                            : doseStatus === "missed"
                            ? "Missed"
                            : doseStatus === "due"
                            ? "Due"
                            : "Upcoming";

                        const badgeColor =
                          doseStatus === "taken"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/60"
                            : doseStatus === "late"
                            ? "bg-amber-500/10 text-amber-200 border border-amber-300/60"
                            : doseStatus === "missed"
                            ? "bg-rose-500/15 text-rose-200 border border-rose-400/70"
                            : doseStatus === "due"
                            ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/70"
                            : "bg-slate-700/40 text-slate-200 border border-slate-500/70";

                        return (
                          <div
                            key={dose.medicineId + dose.scheduledTime}
                            className={`rounded-xl sm:rounded-2xl px-4 sm:px-5 py-5 sm:py-6 transition-transform duration-200 hover:-translate-y-1 ${themeClass}`}
                          >
                            <div className="flex flex-col gap-2 sm:gap-3">
                              <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
                                <span className="text-lg sm:text-xl font-semibold text-gray-50">
                                  {dose.name}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap capitalize ${badgeColor}`}
                                >
                                  {statusLabel}
                                </span>
                              </div>

                              <div className="text-xs sm:text-sm text-slate-200 flex gap-2 items-center">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300" />
                                {new Date(
                                  dose.scheduledTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>

                              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3 flex-wrap">
                                {doseStatus === "upcoming" ? (
                                  <span className="font-medium text-slate-200 text-xs sm:text-sm">
                                    Upcoming dose
                                  </span>
                                ) : doseStatus === "due" ? (
                                  <>
                                    <button
                                      className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold
                                      bg-emerald-500/90 text-slate-900
                                      hover:bg-emerald-400
                                      shadow-[0_10px_25px_rgba(16,185,129,0.35)]
                                      transition-all"
                                      onClick={() =>
                                        handleIntake(
                                          dose.medicineId,
                                          dose.scheduledTime,
                                          "taken"
                                        )
                                      }
                                    >
                                      Mark as Taken
                                    </button>
                                    <button
                                      className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold
                                      bg-rose-500/90 text-slate-50
                                      hover:bg-rose-400
                                      shadow-[0_10px_25px_rgba(248,113,113,0.35)]
                                      transition-all"
                                      onClick={() =>
                                        handleIntake(
                                          dose.medicineId,
                                          dose.scheduledTime,
                                          "missed"
                                        )
                                      }
                                    >
                                      Mark as Missed
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>

                {/* RIGHT: Actions + Progress */}
                <aside className="space-y-6 sm:space-y-8">
                  {/* Button group */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-stretch xl:justify-end w-full">
                    <button
                      onClick={() => navigate("/medicine")}
                      className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl
                      text-sm md:text-base font-semibold tracking-wide
                      bg-gradient-to-r from-cyan-500 to-emerald-400
                      text-slate-950
                      shadow-[0_18px_40px_rgba(34,197,94,0.45)]
                      hover:from-cyan-400 hover:to-emerald-300
                      transition-all"
                    >
                      + Add Medicine
                    </button>
                    <button
                      onClick={() => navigate("/getUserHistory")}
                      className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl
                      text-sm md:text-base font-semibold tracking-wide
                      bg-slate-900/80 border border-slate-600
                      text-gray-100
                      hover:border-cyan-400 hover:text-white
                      shadow-[0_12px_30px_rgba(15,23,42,0.9)]
                      transition-all"
                    >
                      Manage Medicines
                    </button>
                  </div>

                  {/* Daily Progress card */}
                  <div className="w-full max-w-lg bg-slate-950/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(15,23,42,1)] border border-cyan-400/40 flex flex-col items-center mx-auto xl:mx-0">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-cyan-100 mb-4 text-center">
                      Daily Progress
                    </h4>
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6">
                      <svg
                        className="absolute inset-0"
                        width="160"
                        height="160"
                        viewBox="0 0 160 160"
                      >
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#020617"
                          strokeWidth="10"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="10"
                          strokeDasharray={440}
                          strokeDashoffset={440 - (percent / 100) * 440}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 1s" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-100">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-4 text-xs md:text-sm">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        <span className="font-medium text-emerald-200">
                          On Time: {onTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                        <span className="font-medium text-amber-200">
                          Late: {late}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                        <span className="font-medium text-rose-200">
                          Missed: {missed}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="font-medium text-gray-200">
                          Total: {total}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full mt-4">
                      <div className="flex-1 h-3 sm:h-4 rounded-xl bg-slate-900 overflow-hidden shadow-inner flex">
                        <div
                          className="h-3 sm:h-4 bg-emerald-500"
                          style={{
                            width:
                              total === 0 ? 0 : `${(onTime / total) * 100}%`,
                          }}
                        />
                        <div
                          className="h-3 sm:h-4 bg-amber-400"
                          style={{
                            width:
                              total === 0 ? 0 : `${(late / total) * 100}%`,
                          }}
                        />
                        <div
                          className="h-3 sm:h-4 bg-rose-500"
                          style={{
                            width:
                              total === 0 ? 0 : `${(missed / total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Weekly chart below everything, full width of container */}
              <div className="mt-8 sm:mt-10">
                <WeeklyProgressChart />
              </div>
            </div>
          </main>
        </div>
      </div>

      {isChatbotOpen && (
        <ChatbotWidget
          userId={user?._id || user?.id}
          open={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}
    </>
  );
}
