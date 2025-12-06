


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
      await fetch(`https://medico-backend-hjxm.onrender.com/notifications/${notifId}`, {



        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    } catch (e) {
      console.error("Failed to delete notification", e);
    } finally {
      setLoading(false);
    }
  };

  //  auto-refresh


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
      intervalId = setInterval(fetchNotifications, 60000); // auto-refresh every 1 min
    }

    return () => clearInterval(intervalId);
  }, [user, getNotifications]);


  return (
    <div className="min-h-screen px-6 py-8 bg-black flex flex-col">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 drop-shadow-glow flex gap-2 items-center">
        <Bell size={30} className="text-yellow-300" />
        Notifications
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={36} className="animate-spin text-yellow-400" />
        </div>
      ) : notifications.length === 0 ? (


        <div className="py-16 text-center text-gray-300 bg-[#18181b] rounded-xl shadow-[0_0_20px_#FFD70022]">
          <AlertCircle size={36} className="mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-semibold text-yellow-400 mb-2 drop-shadow-glow">
            No notifications
          </h3>

          <p>You're all caught up for today!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notif) => {
            const icon =
              notif.type === "missed" ? (

                <AlertCircle size={28} className="mt-1 text-red-500" />
              ) : notif.type === "late" ? (

                <Clock size={28} className="mt-1 text-yellow-400" />
              ) : (

                <Pill size={28} className="mt-1 text-green-400" />
              );

            return (
              <div
                key={notif._id}
                className="flex items-start gap-5 bg-[#18181b] rounded-xl shadow-[0_0_16px_#FFD70016] border border-yellow-500/20 p-5 relative"
              >
                {icon}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-yellow-300">
                    {notif.medicineName || "Medicine Reminder"}
                  </h4>
                  <p className="text-gray-200 text-sm mt-1">{notif.message}</p>
                
                </div>
                <button
                  title="Delete notification"
                  disabled={loading}
                  onClick={() => handleDelete(notif._id)}
                  className="rounded-md p-2 hover:bg-yellow-500/20 transition absolute top-4 right-4"
                  style={{ background: "none", border: "none" }}
                >
                  <Trash2 size={22} className="text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
