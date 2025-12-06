

import React, { useContext } from "react";
import "boxicons/css/boxicons.min.css";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; 





const Hero = () => {



  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 

 
  const handleDocumentationClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/documentation"); 
    }
  };

  const handleGetStartedClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/dashboard"); 
    }
  };

  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)] relative">
      
      
      <div data-aos="fade-right" className="max-w-xl ml-[5%] z-10 mt-[90%] lg:mt-0">
        
        
        <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
          <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center">
            <i className="bx bx-diamond mr-2"></i>
            INTRODUCING
          </div>
        </div>

       
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8">
          Medicine Reminder For <br /> Performers
        </h1>

        
        <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]">
          Medico is a smart wellness platform offering medicine reminders, interactive dashboards, 
          and holistic health tracking for improved lifestyle balance.
        </p>

       
        <div className="flex gap-4 mt-12">
          
          <button
            onClick={handleGetStartedClick}
            className="border border-[#2a2a2a] py-2 sm:py-3 px-8 sm:px-10 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a] bg-gray-300 text-black hover:text-white"
          >
            Get Started <i className="bx bx-link-external ml-1"></i>
          </button>
        </div>
      </div>

      <Spline
        data-aos="zoom-in"
        className="absolute lg:top-0 top-[-20%] bottom-0 lg:left-[25%] sm:left-[-2%] h-full pointer-events-none"
        scene="https://prod.spline.design/dYIfTyrJ3P0YKxCD/scene.splinecode"
      />
    </main>
  );
};

export default Hero;
