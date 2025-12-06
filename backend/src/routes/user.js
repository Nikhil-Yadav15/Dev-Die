import { Router } from "express";

import { getWeeklyProgress } from "../controllers/progress.control.js"; 

import {
  googleLogin,
  login,
  register,
  medicine,
  getUserHistory,
  updateMedicineById,
  deleteMedicineById,
  trackMedicineIntake,
  getTodayDoses,
  getNotifications,
  deleteNotification,
  getUpcomingMedicines,
} from "../controllers/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { 
  validateRequired, 
  validateEmail, 
  validateObjectId,
  sanitizeInput 
} from "../middleware/validation.middleware.js";
import { 
  authLimiter, 
  createLimiter, 
  notificationLimiter 
} from "../middleware/rateLimiter.middleware.js";

const router = Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes - Authentication
router.post("/register", authLimiter, validateRequired(['name', 'email', 'password']), validateEmail, register);
router.post("/login", authLimiter, validateRequired(['email', 'password']), validateEmail, login);
router.post("/auth/google", authLimiter, validateRequired(['token']), googleLogin);

// Protected routes - Medicine Management
router.post("/medicine", authenticate, createLimiter, validateRequired(['userId', 'name', 'frequencyPerDay', 'times', 'startDate', 'endDate']), medicine);
router.get("/getUserHistory", authenticate, getUserHistory);
router.put("/medicine/:id", authenticate, validateObjectId(), updateMedicineById);
router.delete("/medicine/:id", authenticate, validateObjectId(), deleteMedicineById);
router.post("/medicine/track", authenticate, validateRequired(['medicineId', 'scheduledTime', 'actualTime', 'status']), trackMedicineIntake);
router.get("/medicine/today", authenticate, getTodayDoses);
router.get("/medicine/upcoming", authenticate, getUpcomingMedicines);

// Protected routes - Notifications
router.get("/notifications", authenticate, notificationLimiter, getNotifications);
router.delete("/notifications/:id", authenticate, validateObjectId(), deleteNotification);

// Protected routes - Progress
router.get("/progress/weekly", authenticate, getWeeklyProgress); 


export default router;
