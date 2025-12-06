import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bell, Activity, Settings } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar({ closeSidebar }) {
  const location = useLocation();
    const { user } = useContext(AuthContext);

  const links = [
  { to: "/home", label: "Home", icon: <Home size={20} /> },
    { to: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { to: "/dashboard", label: "Dashboard",  icon: <Activity size={20} /> },
  
   ];

   
  return (
    <aside className="flex flex-col h-full bg-black text-gray-300 shadow-xl rounded-tr-2xl rounded-br-2xl overflow-hidden">
     
      <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-center">
        <h2 className="text-xl font-bold text-yellow-400 tracking-wide">
           {user?.name || "Alchemist"}
        </h2>
      </div>

      
      <nav className="flex flex-col mt-6 px-2 gap-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                  : "hover:bg-gray-800 hover:text-yellow-400 hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}