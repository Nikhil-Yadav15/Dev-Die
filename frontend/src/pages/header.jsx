


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

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setUser(null); 
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20 relative">
      
      <h1
        className="text-3xl md:text-4xl lg:text-5xl font-light cursor-pointer"
        onClick={() => navigate("/home")}
      >
        MEDICO
      </h1>

    
      <nav className="hidden md:flex items-center gap-10">
        <Link
          to="/dashboard"
          onClick={(e) => handleProtectedNav(e, "/dashboard")}
          className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center"
        >
          My Account
        </Link>

        <Link to="/about" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
          About Us
        </Link>

        <Link to="/contact" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
          Contact
        </Link>

        <Link to="/support" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
          Support
        </Link>
      </nav>

   
      {!user ? (
        <button
          onClick={handleSignIn}
          className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full
            font-medium transition-all duration-500 hover:bg-white hover:text-black"
        >
          SIGN IN
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full
            font-medium transition-all duration-500 hover:bg-white hover:text-black"
        >
          LOGOUT
        </button>
      )}


      

   



      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-3xl p-2 hover:text-gray-400 transition-colors"
        aria-label="Toggle menu"
      >
        <i className="bx bx-menu"></i>
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-black text-white z-40 transform transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
       
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
          <h2 className="text-xl font-light">Menu</h2>
          <button
            onClick={toggleMobileMenu}
            className="text-3xl hover:text-gray-400 transition-colors"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

       
        <nav className="flex flex-col gap-6 px-6 mt-6">
        

          <Link to="/about" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
            About Us
          </Link>

          <Link to="/contact" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
            Contact
          </Link>

          <Link to="/support" className="m-5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md 
              hover:bg-gray-200 transition-colors duration-300 text-center">
            Support
          </Link>

  
          {!user ? (
            <button
              onClick={handleSignIn}
              className="w-full mt-4 bg-[#a7a7a7] text-black py-3 rounded-full
                font-medium transition-all duration-500 hover:bg-white hover:text-black"
            >
              SIGN IN
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-[#a7a7a7] text-black py-3 rounded-full
                font-medium transition-all duration-500 hover:bg-white hover:text-black"
            >
              LOGOUT
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
