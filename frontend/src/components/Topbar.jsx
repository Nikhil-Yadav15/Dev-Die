

import { Bell } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "black",
        color: "#FFD700",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #222",
        zIndex: 10,
      }}
    >
      <button
        style={{
          position: "relative",
          padding: 0,
          background: "none",
          border: "none",
          marginRight: 16,
          color: "#FFD700",
          cursor: "pointer",
        }}
        aria-label="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <Bell size={28} />
        <span
          style={{
            position: "absolute",
            top: 2,
            right: -2,
            width: 11,
            height: 11,
            background: "#FF1744",
            borderRadius: "50%",
            border: "2px solid #222",
            boxShadow: "0 0 6px #FFD700",
            display: "block",
          }}
        />
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "2px solid #FFD700",
          }}
        />
        <span
          style={{
            color: "white",
            fontWeight: 600,
            fontSize: 15,
            marginLeft: 4,
            letterSpacing: 0.2,
          }}
        >
          {user?.name || "Alchemist"}
        </span>
      </div>
    </header>
  );
}

