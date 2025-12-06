import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <header className="flex justify-between items-center py-6 px-6 lg:px-20 relative backdrop-blur-sm text-gray-100">
      
      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide cursor-pointer 
        bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent"
        onClick={() => navigate("/home")}
      >
        MEDICO
      </h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <Link
          to="/dashboard"
          onClick={(e) => handleProtectedNav(e, "/dashboard")}
          className="text-sm font-medium uppercase tracking-wide text-gray-300 
          hover:text-white transition-colors"
        >
          My Account
        </Link>

        <Link
          to="/about"
          className="text-sm font-medium uppercase tracking-wide text-gray-300 
          hover:text-white transition-colors"
        >
          About
        </Link>

        <Link
          to="/contact"
          className="text-sm font-medium uppercase tracking-wide text-gray-300 
          hover:text-white transition-colors"
        >
          Contact
        </Link>

        <Link
          to="/support"
          className="text-sm font-medium uppercase tracking-wide text-gray-300 
          hover:text-white transition-colors"
        >
          Support
        </Link>
      </nav>

      {/* Auth Button — Desktop */}
      {!user ? (
        <button
          onClick={handleSignIn}
          className="hidden md:block px-6 py-2 rounded-full text-sm font-medium uppercase
          bg-gradient-to-r from-gray-100 to-gray-300 text-black shadow-sm
          hover:shadow-lg transition-all"
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="hidden md:block px-6 py-2 rounded-full text-sm font-medium uppercase
          bg-gradient-to-r from-gray-100 to-gray-300 text-black shadow-sm
          hover:shadow-lg transition-all"
        >
          Logout
        </button>
      )}

      {/* Mobile Hamburger */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-3xl p-2 text-gray-300 hover:text-gray-100 transition"
      >
        <i className="bx bx-menu"></i>
      </button>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-[#0c0c0c] text-gray-100 z-40 
        border-l border-gray-800 transform transition-transform duration-500 ease-in-out 
        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-5 py-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={toggleMobileMenu}
            className="text-3xl hover:text-gray-400 transition"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col gap-6 px-6 mt-6 text-lg font-medium">
          
          <Link
            to="/dashboard"
            onClick={(e) => handleProtectedNav(e, "/dashboard")}
            className="py-2 text-gray-300 hover:text-white transition"
          >
            My Account
          </Link>

          <Link
            to="/about"
            className="py-2 text-gray-300 hover:text-white transition"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="py-2 text-gray-300 hover:text-white transition"
          >
            Contact
          </Link>

          <Link
            to="/support"
            className="py-2 text-gray-300 hover:text-white transition"
          >
            Support
          </Link>

          {!user ? (
            <button
              onClick={handleSignIn}
              className="mt-6 w-full px-6 py-3 rounded-full 
              bg-gradient-to-r from-gray-200 to-gray-400 text-black uppercase 
              font-semibold tracking-wide shadow-md hover:shadow-xl transition-all"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-6 w-full px-6 py-3 rounded-full 
              bg-gradient-to-r from-gray-200 to-gray-400 text-black uppercase 
              font-semibold tracking-wide shadow-md hover:shadow-xl transition-all"
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
