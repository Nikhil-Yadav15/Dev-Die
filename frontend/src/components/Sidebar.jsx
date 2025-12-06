import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bell, Activity } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar({ closeSidebar }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const links = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard", label: "Dashboard", icon: Activity },
  ];

  return (
    <aside className="flex h-full flex-col bg-[#020617] text-slate-100 border-r border-slate-800 rounded-tr-2xl rounded-br-2xl">
      
      {/* Header / User */}
      <div className="px-6 py-6 border-b border-slate-800 flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center text-sm font-semibold text-cyan-300 uppercase">
          {(user?.name || "U").slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Signed in</p>
          <h2 className="text-lg font-semibold text-slate-50 truncate">
            {user?.name || "User"}
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              onClick={closeSidebar}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium
              transition-all duration-200 border ${
                isActive
                  ? "bg-slate-900 text-slate-50 border-cyan-500/70"
                  : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-50 border-transparent"
              }`}
            >
              <Icon
                size={22}
                className={
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:text-cyan-300"
                }
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-900 text-xs text-slate-500 tracking-wide">
        Medico · Dashboard
      </div>
    </aside>
  );
}
