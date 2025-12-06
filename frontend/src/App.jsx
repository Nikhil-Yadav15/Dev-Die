
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";


import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import Support from "./pages/support";
import Contact from "./pages/contact";
import About from "./pages/about";

import  Dashboard from "./pages/dashboard";
import  MedicineForm  from "./pages/medicine";
import UserMedicinesManager from "./pages/editmedicine";
import Notifications from "./pages/notifications";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medicine" element={<MedicineForm />} />
         <Route path="/getUserHistory" element={<UserMedicinesManager />} />
          <Route path="/notifications" element={<Notifications />} />


          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

