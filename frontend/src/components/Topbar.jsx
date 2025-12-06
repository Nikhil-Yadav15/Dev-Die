

import { Bell } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="h-14 sm:h-16 bg-slate-950/80 text-cyan-300 flex justify-end items-center px-4 sm:px-6 border-b border-slate-800 z-10">
      <button
        className="relative p-0 bg-transparent border-none mr-3 sm:mr-4 text-cyan-300 hover:text-cyan-200 cursor-pointer transition-colors"
        aria-label="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <Bell size={24} className="sm:w-7 sm:h-7" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
      </button>
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-cyan-400"
        />
        <span className="text-white font-semibold text-sm sm:text-base tracking-wide hidden sm:inline">
          {user?.name || "User"}
        </span>
      </div>
    </header>
  );
}

