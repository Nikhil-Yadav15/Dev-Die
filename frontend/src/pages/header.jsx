import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleProtectedNav = (event, path) => {
    if (!user) {
      event.preventDefault();
      navigate("/login");
    }
  };

  const handleSignIn = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  // Smooth scroll to section on home page
  const scrollToSection = (sectionId) => {
    const isOnHomePage = location.pathname === "/home";

    if (isOnHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/home#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="flex justify-between items-center py-4 px-6 lg:px-20 sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-white/5 text-gray-100">
      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide cursor-pointer 
        bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        onClick={() => navigate("/home")}
      >
        MEDICO
      </h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <Link
          to="/dashboard"
          onClick={(e) => handleProtectedNav(e, "/dashboard")}
          className={`text-sm font-medium uppercase tracking-wide transition-colors ${
            isDashboard ? "text-white" : "text-gray-300 hover:text-white"
          }`}
        >
          My Account
        </Link>

        <button
          type="button"
          onClick={() => scrollToSection("about")}
          className="text-sm font-medium uppercase tracking-wide transition-colors
          text-gray-300 hover:text-white
          bg-transparent border-0 outline-none
          focus:outline-none focus:ring-0
          p-0 m-0"
        >
          About
        </button>



        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          className="text-sm font-medium uppercase tracking-wide transition-colors
          text-gray-300 hover:text-white
          bg-transparent border-0 outline-none
          focus:outline-none focus:ring-0
          p-0 m-0"
        >
          Contact
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("support")}
          className="text-sm font-medium uppercase tracking-wide transition-colors
          text-gray-300 hover:text-white
          bg-transparent border-0 outline-none
          focus:outline-none focus:ring-0
          p-0 m-0"
        >
          Support
        </button>
      </nav>

      {/* Auth Button — Desktop */}
      {!user ? (
        <button
          type="button"
          onClick={handleSignIn}
          className="hidden md:inline-flex items-center justify-center px-6 py-2 rounded-full 
          text-sm font-medium uppercase tracking-wide
          bg-gradient-to-r from-[#0f172a] to-[#1f2937]
          text-white border border-gray-700
          hover:from-[#111827] hover:to-[#020617]
          hover:border-gray-400
          shadow-[0_0_18px_rgba(0,0,0,0.8)]
          transition-all duration-300"
        >
          Sign In
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="hidden md:inline-flex items-center justify-center px-6 py-2 rounded-full 
          text-sm font-medium uppercase tracking-wide
          bg-gradient-to-r from-[#0f172a] to-[#1f2937]
          text-white border border-gray-700
          hover:from-[#111827] hover:to-[#020617]
          hover:border-gray-400
          shadow-[0_0_18px_rgba(0,0,0,0.8)]
          transition-all duration-300"
        >
          Logout
        </button>
      )}

      {/* Mobile Hamburger */}
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="md:hidden text-3xl p-2 text-gray-300 hover:text-white transition"
        aria-label="Toggle navigation menu"
      >
        <i className="bx bx-menu"></i>
      </button>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-black/95 text-gray-100 z-40 
        border-l border-gray-800 transform transition-transform duration-500 ease-in-out 
        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-5 py-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-3xl hover:text-gray-400 transition"
            aria-label="Close navigation menu"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col gap-6 px-6 mt-6 text-lg font-medium">
          <Link
            to="/dashboard"
            onClick={(e) => {
              handleProtectedNav(e, "/dashboard");
              setIsMobileMenuOpen(false);
            }}
            className="py-2 text-gray-300 hover:text-white transition"
          >
            My Account
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="py-2 text-gray-300 hover:text-white transition text-left"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="py-2 text-gray-300 hover:text-white transition text-left"
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("support")}
            className="py-2 text-gray-300 hover:text-white transition text-left"
          >
            Support
          </button>

          {!user ? (
            <button
              type="button"
              onClick={handleSignIn}
              className="mt-6 w-full px-6 py-3 rounded-full 
              bg-gradient-to-r from-[#0f172a] to-[#1f2937] text-white uppercase 
              font-semibold tracking-wide border border-gray-700
              shadow-[0_0_18px_rgba(0,0,0,0.9)]
              hover:from-[#111827] hover:to-[#020617]
              hover:border-gray-400
              transition-all duration-300"
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 w-full px-6 py-3 rounded-full 
              bg-gradient-to-r from-[#0f172a] to-[#1f2937] text-white uppercase 
              font-semibold tracking-wide border border-gray-700
              shadow-[0_0_18px_rgba(0,0,0,0.9)]
              hover:from-[#111827] hover:to-[#020617]
              hover:border-gray-400
              transition-all duration-300"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
