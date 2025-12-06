



import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cron from "node-cron";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";

import { User } from "../models/user.model.js";
import { Medicine } from "../models/medicine.model.js";
import { Notification } from "../models/notification.model.js";
import { MedicineProgress } from "../models/progress.model.js";
import { sendEmail } from "../utils/emailservise.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const IST = "Asia/Kolkata";

// ---------------- TIMEZONE HELPERS ---------------- //
const toIST = (date) => new Date(formatInTimeZone(date, IST, "yyyy-MM-dd'T'HH:mm"));
const formatIST = (date, pattern = "yyyy-MM-dd HH:mm") => formatInTimeZone(date, IST, pattern);
const createISTDate = (dateStrTimeStr) => zonedTimeToUtc(dateStrTimeStr, IST);

// ---------------- GOOGLE LOGIN ---------------- //
const googleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(httpStatus.BAD_REQUEST).json({ message: "Google token required" });

  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) user = await new User({ name, email, googleId }).save();
    else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const appToken = crypto.randomBytes(20).toString("hex");
    user.token = appToken;
    await user.save();

    res.status(httpStatus.OK).json({
      message: "Google login successful",
      token: appToken,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (e) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: "Google Login error: " + e.message });
  }
};

// ---------------- NOTIFICATIONS ---------------- //
const createNotification = async (userId, type, medicineName, doseTime, message) => {
  try {
    const existing = await Notification.findOne({
      userId,
      type,
      medicineName,
      doseTime,
      createdAt: { $gte: new Date(Date.now() - 5601000) }
    });
    if (existing) return;

    await new Notification({ userId, type, medicineName, doseTime, message }).save();
    
    const user = await User.findById(userId);

    if (user?.email) await sendEmail(user.email, `Medico - ${type.charAt(0).toUpperCase() + type.slice(1)}`, message);

  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

// ---------------- AUTH ---------------- //
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(httpStatus.BAD_REQUEST).json({ message: "Email & password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    if (!await bcrypt.compare(password, user.password)) return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    res.status(httpStatus.OK).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, name: user.name }
    });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields required" });

  try {
    if (await User.findOne({ email })) return res.status(httpStatus.CONFLICT).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({ name, email, password: hashedPassword }).save();

    res.status(httpStatus.CREATED).json({ message: "Registered successfully", user });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- MEDICINE CRUD ---------------- //
const medicine = async (req, res) => {
  try {
    const { userId, name, frequencyPerDay, times, startDate, endDate } = req.body;
    if (!userId || !name || !frequencyPerDay || !times || times.length !== frequencyPerDay || !startDate || !endDate)
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid input" });

    const med = await new Medicine({ userId, name, frequencyPerDay, times, startDate, endDate }).save();
    res.status(httpStatus.CREATED).json({ message: "Medicine created", medicine: med });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });

    const medicines = await Medicine.find({ userId: user._id });
    res.json(medicines);

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const updateMedicineById = async (req, res) => {
  const { id } = req.params;
  const { userId, name, frequencyPerDay, times, startDate, endDate } = req.body;

  try {
    const med = await Medicine.findById(id);
    if (!med) return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });
    if (med.userId.toString() !== userId) return res.status(httpStatus.FORBIDDEN).json({ message: "Unauthorized" });

    Object.assign(med, { name, frequencyPerDay, times, startDate, endDate });
    await med.save();
    res.json({ message: "Medicine updated", medicine: med });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const deleteMedicineById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const med = await Medicine.findById(id);
    if (!med) return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });
    if (med.userId.toString() !== userId) return res.status(httpStatus.FORBIDDEN).json({ message: "Unauthorized" });

    await med.deleteOne();
    res.json({ message: "Medicine deleted" });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- TODAY DOSES ---------------- //
const getTodayDoses = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });

    const medicines = await Medicine.find({ userId: user._id });
    const todayStr = formatIST(new Date(), "yyyy-MM-dd");
    const doses = [];

    medicines.forEach(med => {
      med.times.forEach(time => {
        const scheduledTime = createISTDate(`${todayStr}T${time}:00`);
        const start = toIST(med.startDate);
        const end = toIST(med.endDate);

        if (scheduledTime >= start && scheduledTime <= end) {
          const log = (med.takenLogs || []).find(l => new Date(l.scheduledTime).toISOString() === new Date(scheduledTime).toISOString());
          doses.push({ medicineId: med._id, name: med.name, scheduledTime, log: log || null });
        }
      });
    });

    res.json(doses);

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- TRACK MEDICINE ---------------- //
const trackMedicineIntake = async (req, res) => {
  const { medicineId, scheduledTime, actualTime, status } = req.body;
  if (!medicineId || !scheduledTime || !actualTime || !status) return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields required" });

  try {
    const med = await Medicine.findById(medicineId);
    if (!med) return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });

    med.takenLogs = (med.takenLogs || []).filter(l => new Date(l.scheduledTime).toISOString() !== new Date(scheduledTime).toISOString());
    med.takenLogs.push({ scheduledTime, actualTime, status });
    await med.save();

    const intakeDate = toIST(new Date(scheduledTime));
    intakeDate.setHours(0, 0, 0, 0);

    let progress = await MedicineProgress.findOne({ userId: med.userId, medicineId: med._id, date: intakeDate });

    if (progress) {
      if (status === "taken" || status === "late") {
        progress.dosesTaken += 1;
        await progress.save();
      }
    } else {
      await new MedicineProgress({
        userId: med.userId,
        medicineId: med._id,
        date: intakeDate,
        dosesTaken: (status === "taken" || status === "late") ? 1 : 0,
        dosesScheduled: med.frequencyPerDay
      }).save();
    }

    if (status === "missed") {
      await createNotification(med.userId, "missed", med.name, formatIST(new Date(scheduledTime), "hh:mm a"), `Missed ${med.name} scheduled at ${formatIST(new Date(scheduledTime), "hh:mm a")}`);
    } else if (status === "late") {
      await createNotification(med.userId, "late", med.name, formatIST(new Date(scheduledTime), "hh:mm a"), `Late ${med.name} dose scheduled at ${formatIST(new Date(scheduledTime), "hh:mm a")}`);
    }

    res.json({ message: "Intake logged", medicine: med });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- NOTIFICATIONS ---------------- //
const getNotifications = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });

    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(notifications);

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Deleted" });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- UPCOMING MEDICINES ---------------- //
const getUpcomingMedicines = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });

    const now = toIST(new Date());
    const window = new Date(now.getTime() + 60 * 1000);
    const today = formatIST(now, "yyyy-MM-dd");
    const meds = await Medicine.find({ userId: user._id });

    const upcoming = [];
    for (const med of meds) {
      for (const time of med.times) {
        const dose = createISTDate(`${today}T${time}:00`);
        if (dose >= now && dose <= window) {
          await createNotification(user._id, "reminder", med.name, time, `Time to take ${med.name} at ${time}`);
          upcoming.push({ medicineId: med._id, name: med.name, scheduledTime: dose });
        }
      }
    }

    res.json(upcoming);

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

// ---------------- CRON JOB ---------------- //
cron.schedule("* * * * *", async () => {
  try {
    const now = toIST(new Date());
    const window = new Date(now.getTime() + 601000);
    const today = formatIST(now, "yyyy-MM-dd");

    const users = await User.find();
    for (const user of users) {
      const meds = await Medicine.find({ userId: user._id });
      for (const med of meds) {
        for (const time of med.times) {
          const dose = createISTDate(`${today}T${time}:00`);
          if (dose >= now && dose <= window) {
            await createNotification(user._id, "reminder", med.name, time, `Time to take ${med.name} at ${time}`);
          }
        }
      }
    }

  } catch (e) {
    console.error("Cron failed:", e.message);
  }
});

export {
  googleLogin,
  login,
  register,
  medicine,
  getUserHistory,
  updateMedicineById,
  deleteMedicineById,
  getTodayDoses,
  trackMedicineIntake,
  getNotifications,
  deleteNotification,
  getUpcomingMedicines
};
