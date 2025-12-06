


import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cron from "node-cron";
import { format } from 'date-fns-tz';

import { User } from "../models/user.model.js";
import { Medicine } from "../models/medicine.model.js";
import { Notification } from "../models/notification.model.js";
import { sendEmail } from "../utils/emailservise.js";
import { MedicineProgress } from "../models/progress.model.js";


import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);





const googleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Google token required" });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    
    const appToken = crypto.randomBytes(20).toString("hex");
    user.token = appToken;
    await user.save();

    return res.status(httpStatus.OK).json({
      message: "Google login successful",
      token: appToken,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (e) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Google Login error: " + e.message });
  }
};

const createNotification = async (userId, type, medicineName, doseTime, message) => {
  try {
    const recentNotif = await Notification.findOne({
      userId,
      type,
      medicineName,
      doseTime,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, 
    });

    if (recentNotif) return;

    const notif = new Notification({
      userId,
      type,
      medicineName,
      doseTime,
      message,
    });

    await notif.save();

 
    const user = await User.findById(userId);
    if (user?.email) {
      await sendEmail(
        user.email,
        `Medico - Medicine ${type === "reminder" ? "Reminder" : type.charAt(0).toUpperCase() + type.slice(1)}`,
        message
      );
    }
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};


//    LOGIN

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, name: user.name },
    });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${e.message}` });
  }
};


//  REGISTER

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${e.message}` });
  }
};


//  CREATE MEDICINE

const medicine = async (req, res) => {
  try {
    const { userId, name, frequencyPerDay, times, startDate, endDate } = req.body;

    if (
      !userId ||
      !name ||
      !frequencyPerDay ||
      !times ||
      !Array.isArray(times) ||
      times.length !== Number(frequencyPerDay) ||
      !startDate ||
      !endDate
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message:
          "All fields are required and times array length should match frequencyPerDay",
      });
    }

    const newMedicine = new Medicine({
      userId,
      name,
      frequencyPerDay,
      times,
      startDate,
      endDate,
    });

    await newMedicine.save();

    return res.status(httpStatus.CREATED).json({
      message: "Medicine record created successfully",
      medicine: newMedicine,
    });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Failed to create medicine: ${e.message}` });
  }
};


//  GET USER HISTORY

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Token is required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const medicines = await Medicine.find({ userId: user._id });
    return res.status(httpStatus.OK).json(medicines);
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${e.message}` });
  }
};


//  UPDATE MEDICINE

const updateMedicineById = async (req, res) => {
  const { id } = req.params;
  const { userId, name, frequencyPerDay, times, startDate, endDate } = req.body;

  if (
    !userId ||
    !name ||
    !frequencyPerDay ||
    !times ||
    !Array.isArray(times) ||
    times.length !== Number(frequencyPerDay) ||
    !startDate ||
    !endDate
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message:
        "All fields are required and times array length should match frequencyPerDay",
    });
  }

  try {
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });
    }

    if (medicine.userId.toString() !== userId) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Not authorized to update this medicine" });
    }

    medicine.name = name;
    medicine.frequencyPerDay = frequencyPerDay;
    medicine.times = times;
    medicine.startDate = startDate;
    medicine.endDate = endDate;

    await medicine.save();
    res.json({ message: "Medicine successfully updated", medicine });
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Failed to update: ${e.message}` });
  }
};


//  DELETE MEDICINE

const deleteMedicineById = async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;

  try {
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });
    }

    if (medicine.userId.toString() !== userId) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Not authorized to delete this medicine" });
    }

    await medicine.deleteOne(); 
    res.json({ message: "Medicine successfully deleted" });
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Failed to delete: ${e.message}` });
  }
};


//  GET TODAY'S DOSES

const getTodayDoses = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });
  }
  try {
    const user = await User.findOne({ token });
    if (!user) throw Error("User not found");
    const medicines = await Medicine.find({ userId: user._id });

    const timeZone = 'Asia/Kolkata';
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd', { timeZone }); 

    const doses = [];
    medicines.forEach((med) => {
      med.times.forEach((time) => {

     

        const scheduledTime = new Date(`${todayStr}T${time}:00+05:30`);
        if (scheduledTime >= med.startDate && scheduledTime <= med.endDate) {
          const log = (med.takenLogs || []).find(
            (l) => new Date(l.scheduledTime).toISOString() === scheduledTime.toISOString()
          );
          doses.push({
            medicineId: med._id,
            name: med.name,
            scheduledTime,
            log: log || null,
          });
        }
      });
    });

    res.json(doses);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed: ${e.message}` });
  }
};


//  TRACK MEDICINE INTAKE

const trackMedicineIntake = async (req, res) => {
  const { medicineId, scheduledTime, actualTime, status } = req.body;
  if (!medicineId || !scheduledTime || !actualTime || !status) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "All fields required" });
  }

  try {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Medicine not found" });
    }

    medicine.takenLogs = (medicine.takenLogs || []).filter(
      (log) =>
        new Date(log.scheduledTime).toISOString() !==
        new Date(scheduledTime).toISOString()
    );
    medicine.takenLogs.push({ scheduledTime, actualTime, status });
    await medicine.save();

const intakeDate = new Date(scheduledTime);
intakeDate.setHours(0, 0, 0, 0);

const progressRecord = await MedicineProgress.findOne({
  userId: medicine.userId,
  medicineId: medicine._id,
  date: intakeDate,
});

if (progressRecord) {
  if (status === "taken" || status === "late") {
    progressRecord.dosesTaken += 1;
    await progressRecord.save();
  }
} else {
  const newProgress = new MedicineProgress({
    userId: medicine.userId,
    medicineId: medicine._id,
    date: intakeDate,
    dosesTaken: status === "taken" || status === "late" ? 1 : 0,
    dosesScheduled: medicine.frequencyPerDay,
  });
  await newProgress.save();
}


   



    if (status === "missed") {
      await createNotification(
        medicine.userId,
        "missed",
        medicine.name,
        new Date(scheduledTime).toLocaleTimeString(),
        `You missed your dose of ${medicine.name} scheduled for ${new Date(
          scheduledTime
        ).toLocaleTimeString()}.`
      );
    } else if (status === "late") {
      await createNotification(
        medicine.userId,
        "late",
        medicine.name,
        new Date(scheduledTime).toLocaleTimeString(),
        `You took your ${medicine.name} dose late (scheduled for ${new Date(
          scheduledTime
        ).toLocaleTimeString()}).`
      );
    }

    res.json({ message: "Intake logged", medicine });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Logging failed: ${e.message}` });
  }
};


//  GET NOTIFICATIONS



const getNotifications = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const notifications = await Notification.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    res.status(httpStatus.OK).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch notifications" });
  }
};


//  DELETE NOTIFICATION


const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Notification deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};


// GET UPCOMING MEDICINES

const getUpcomingMedicines = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const now = new Date();
    const upcomingWindow = new Date(now.getTime() + 1* 60 * 1000);

    const medicines = await Medicine.find({ userId: user._id });
    const upcomingDoses = [];

    for (const med of medicines) {
      for (const time of med.times) {
        const today = new Date().toISOString().substring(0, 10);
        const doseTime = new Date(`${today}T${time}`);

        if (doseTime >= now && doseTime <= upcomingWindow) {
          await createNotification(
            user._id,
            "reminder",
            med.name,
            time,
            `Time to take your medicine: ${med.name} at ${time}`
          );

          upcomingDoses.push({
            medicineId: med._id,
            name: med.name,
            scheduledTime: doseTime,
          });
        }
      }
    }

    res.status(httpStatus.OK).json(upcomingDoses);
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch upcoming medicines" });
  }
};


//  CRON : Auto create reminders every minute


cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const upcomingWindow = new Date(now.getTime() + 1 * 60 * 1000);
    const users = await User.find();

    for (const user of users) {
      const medicines = await Medicine.find({ userId: user._id });
      for (const med of medicines) {
        for (const time of med.times) {
          const today = new Date().toISOString().substring(0, 10);
          const doseTime = new Date(`${today}T${time}`);

          if (doseTime >= now && doseTime <= upcomingWindow) {
            await createNotification(
              user._id,
              "reminder",
              med.name,
              time,
              `Time to take your medicine: ${med.name} at ${time}`
            );
          }
        }
      }
    }

    console.log(" Cron job ran: checked medicine reminders.");
  } catch (err) {
    console.error("Cron job failed:", err.message);
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
  getUpcomingMedicines,
};
