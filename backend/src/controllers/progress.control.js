
import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import { MedicineProgress } from "../models/progress.model.js";


const getWeeklyProgress = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Token required" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

   
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({
        key: d.toISOString().slice(0, 10), 
        date: new Date(d), 
      });
    }

    const progress = await MedicineProgress.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: days[0].date },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
          dosesTaken: { $sum: "$dosesTaken" },
          dosesScheduled: { $sum: "$dosesScheduled" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

 
    const progressMap = {};
    progress.forEach(item => {
      progressMap[item._id] = {
        dosesTaken: item.dosesTaken,
        dosesScheduled: item.dosesScheduled,
      };
    });

 
    const result = days.map(({ key, date }) => ({
      _id: key,
      date,
      dosesTaken: progressMap[key]?.dosesTaken || 0,
      dosesScheduled: progressMap[key]?.dosesScheduled || 0,
    }));

    res.status(httpStatus.OK).json(result);
  } catch (err) {
    console.error("Failed to get weekly progress:", err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to get weekly progress" });
  }
};

export { getWeeklyProgress };
