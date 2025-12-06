
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";

import  Dashboard from "./pages/dashboard";
import  MedicineForm  from "./pages/medicine";
import UserMedicinesManager from "./pages/editmedicine";
import Notifications from "./pages/notifications";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/medicine" element={<ProtectedRoute><MedicineForm /></ProtectedRoute>} />
          <Route path="/getUserHistory" element={<ProtectedRoute><UserMedicinesManager /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

