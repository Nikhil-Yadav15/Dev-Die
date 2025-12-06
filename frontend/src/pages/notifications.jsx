import React, { useEffect, useState, useContext } from "react";
import { Bell, Pill, AlertCircle, Clock, Trash2, Loader2 } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function Notifications() {
  const { user, getNotifications } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (notifId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await fetch(
        `https://medico-backend-hjxm.onrender.com/notifications/${notifId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    } catch (e) {
      console.error("Failed to delete notification", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (e) {
        console.error("Failed to load notifications:", e);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchNotifications();
      intervalId = setInterval(fetchNotifications, 60000);
    }

    return () => clearInterval(intervalId);
  }, [user, getNotifications]);

  return (
    <div
      className="min-h-screen px-6 py-8 text-gray-100 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 90% 10%, rgba(14,165,233,0.08) 0%, rgba(2,6,23,1) 35%, rgba(0,0,0,1) 90%)",
      }}
    >
      {/* soft glow layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, rgba(56,189,248,0.16) 0, transparent 60%), radial-gradient(circle at 10% 90%, rgba(34,197,94,0.10) 0, transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/60">
            <Bell size={22} className="text-cyan-300" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Notifications
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Recent alerts about your medications and adherence.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-300" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-14 px-6 text-center text-gray-300 bg-slate-950/80 border border-slate-700 rounded-2xl shadow-[0_0_28px_rgba(15,23,42,0.9)]">
            <AlertCircle size={34} className="mx-auto mb-4 text-cyan-300" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              You’re all caught up. Medico will alert you when something
              important happens.
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            {notifications.map((notif) => {
              const isMissed = notif.type === "missed";
              const isLate = notif.type === "late";

              const icon = isMissed ? (
                <AlertCircle size={26} className="mt-1 text-rose-400" />
              ) : isLate ? (
                <Clock size={26} className="mt-1 text-amber-300" />
              ) : (
                <Pill size={26} className="mt-1 text-emerald-300" />
              );

              const borderClass = isMissed
                ? "border-rose-400/50"
                : isLate
                ? "border-amber-300/50"
                : "border-cyan-400/40";

              return (
                <div
                  key={notif._id}
                  className={`flex items-start gap-4 bg-slate-950/85 rounded-2xl border ${borderClass} px-5 py-4 md:px-6 md:py-5 shadow-[0_0_26px_rgba(15,23,42,0.9)]`}
                >
                  <div className="mt-1">{icon}</div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-sm md:text-base text-white">
                      {notif.medicineName || "Medicine Reminder"}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-300 mt-1">
                      {notif.message}
                    </p>

                    {notif.createdAt && (
                      <p className="text-[11px] md:text-xs text-gray-500 mt-2">
                        {new Date(notif.createdAt).toLocaleString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    )}
                  </div>

                  <button
                    title="Delete notification"
                    disabled={loading}
                    onClick={() => handleDelete(notif._id)}
                    className="ml-2 rounded-md p-1.5 bg-red-500 hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} className="text-black  hover:text-rose-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
