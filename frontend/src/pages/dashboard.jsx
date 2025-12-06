import ChatbotWidget from '../components/ChatbotWidget.jsx';
import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Menu, X, CheckCircle, Clock, XCircle } from "lucide-react"; 
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import WeeklyProgressChart from '../components/GraphCard';



const getPercent = (onTime, late, missed, total) => total === 0 ? 0 : Math.round(((onTime + late * 0.5) / total) * 100);

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
      const res = await fetch(`https://medico-backend-hjxm.onrender.com/medicine/today?token=${token}`);
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
      const isLate = markedStatus === "taken" && now - scheduled > 60 * 60 * 1000;
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

  const pastOrNow = sortedDoses.filter(d => new Date(d.scheduledTime) <= now);
  const onTime = pastOrNow.filter(d => getDisplayStatus(d) === "taken").length;
  const late = pastOrNow.filter(d => getDisplayStatus(d) === "late").length;
  const missed = pastOrNow.filter(d => getDisplayStatus(d) === "missed").length;
  const total = sortedDoses.length;
  const percent = getPercent(onTime, late, missed, total);

  // Card status colors
  const statusTheme = {
    taken: "bg-gradient-to-br from-green-500 via-green-700 to-black border-green-400 text-black",
    late: "bg-gradient-to-br from-yellow-400 via-yellow-700 to-black border-yellow-300 text-black",
    missed: "bg-gradient-to-br from-red-600 via-red-800 to-black border-red-400 text-white",
    due: "bg-gradient-to-br from-blue-600 via-blue-800 to-black border-blue-400 text-white",
    upcoming: "bg-gradient-to-br from-gray-800 via-black to-black border-gray-600 text-gray-200",
  };

  return (
    <>
    <div className="flex min-h-screen bg-black text-gray-100 relative">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/50 transition-opacity"
          />
          <div className="relative w-64 bg-[#18181b] border-l-4 border-yellow-400/30 p-4 shadow-lg rounded-tr-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-yellow-400">{user?.name || "Alchemist"}</span>
              <button className="p-2 rounded-md hover:bg-gray-900 transition" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-200" />
              </button>
            </div>
            <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-900 transition"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-yellow-400" />
           </button>
            <div className="flex items-center gap-6">
              <Topbar />
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="bg-blue-700 text-white px-5 py-2 rounded-full font-bold ml-4"
              >
                Talk to Bot
              </button>
            </div>
          </div> 

        <main className="p-8 flex-1">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6 drop-shadow">
            Welcome back, {user?.name || "Alchemist"} ✨
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Medicine Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
              <h3 className="col-span-1 sm:col-span-2 text-2xl text-yellow-300 font-semibold mb-2">
                Medicines To Take Today
              </h3>
              {loading ? (
                <div className="text-yellow-500">Loading...</div>
              ) : total === 0 ? (
                <div className="col-span-1 sm:col-span-2 bg-[#18181b] border border-yellow-400/30 px-8 py-12 text-yellow-400 rounded-2xl shadow-lg text-center">
                  No medicine for today
                </div>
              ) : (
                sortedDoses.map((dose) => {
                  const doseStatus = getDisplayStatus(dose);
                  const themeClass = statusTheme[doseStatus] || statusTheme["due"];
                  return (
                    <div
                      key={dose.medicineId + dose.scheduledTime}
                      className={`rounded-3xl shadow-xl border-2 px-6 py-7 transition transform hover:scale-105 ${themeClass}`}
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{dose.name}</span>
                          <span className="text-md font-bold px-4 py-1 rounded-full shadow capitalize">
                            {doseStatus === "taken"
                              ? "Taken"
                              : doseStatus === "late"
                              ? "Taken Late"
                              : doseStatus === "missed"
                              ? "Missed"
                              : doseStatus === "due"
                              ? "Due"
                              : "Upcoming"}
                          </span>
                        </div>
                        <div className="text-md text-yellow-200 flex gap-2 items-center">
                          <Clock className="w-4 h-4" /> 
                          {new Date(dose.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="flex gap-3 mt-2">
                          {doseStatus === "upcoming" ? (
                            <span className="font-semibold text-blue-200">Upcoming</span>
                          ) : doseStatus === "due" ? (
                            <>
                              <button
                                className="bg-green-400 hover:bg-green-500 text-black text-lg px-6 py-3 rounded-xl shadow font-bold"
                                onClick={() =>
                                  handleIntake(dose.medicineId, dose.scheduledTime, "taken")
                                }
                              >
                                Taken
                              </button>
                              <button
                                className="bg-red-400 hover:bg-red-500 text-white text-lg px-6 py-3 rounded-xl shadow font-bold"
                                onClick={() =>
                                  handleIntake(dose.medicineId, dose.scheduledTime, "missed")
                                }
                              >
                                Not Taken
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
            {/* RIGHT - Button group and Progress */}
            <div className="flex-1 flex flex-col items-end justify-start">
              {/* Button group */}
              <div className="flex gap-6 mb-10">
                <button
                  onClick={() => navigate("/medicine")}
                  className="bg-yellow-500 hover:bg-yellow-400 transition text-black text-xl px-8 py-4 rounded-2xl shadow-lg font-extrabold"
                >
                  + Add Medicine
                </button>
                <button
                  onClick={() => navigate("/getUserHistory")}
                  className="bg-gray-800 hover:bg-gray-700 transition text-yellow-300 text-xl px-8 py-4 rounded-2xl shadow-lg font-extrabold"
                >
                  Manage Medicine
                </button>
              </div>
              <div className="w-full max-w-lg bg-[#18181b] rounded-3xl p-10 shadow-2xl border-4 border-yellow-400/30 text-center flex flex-col items-center">
                <h4 className="text-3xl font-bold text-yellow-400 mb-5">
                  Daily Progress
                </h4>
                <div className="relative w-44 h-44 mb-6">
                  <svg className="absolute inset-0" width="176" height="176">
                    <circle
                      cx="88"
                      cy="88"
                      r="78"
                      fill="none"
                      stroke="#222"
                      strokeWidth="12"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="78"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="12"
                      strokeDasharray={490}
                      strokeDashoffset={490 - (percent / 100) * 490}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-yellow-400">
                      {percent}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="font-bold text-green-300">On Time: {onTime}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-6 h-6 text-yellow-300" />
                    <span className="font-bold text-yellow-200">Late: {late}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <span className="font-bold text-red-300">Missed: {missed}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-200">Total: {total}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full mt-6">
                  <div className="flex-1 h-5 rounded-xl bg-gray-800 overflow-hidden shadow-inner flex">
                    <div className="h-5 bg-green-400" style={{ width: `${total === 0 ? 0 : (onTime / total) * 100}%` }} />
                    <div className="h-5 bg-yellow-400" style={{ width: `${total === 0 ? 0 : (late / total) * 100}%` }} />
                    <div className="h-5 bg-red-400" style={{ width: `${total === 0 ? 0 : (missed / total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <WeeklyProgressChart />
        </main>
      </div>
      </div>
      {/* ChatbotWidget Popup */}
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

























 
