

import mongoose, { Schema } from "mongoose";

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },

  frequencyPerDay: { type: Number, required: true },
  times: [{ type: String, required: true }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  takenLogs: [
    {
      scheduledTime: { type: Date, required: true },
      actualTime: { type: Date },
      status: { type: String, enum: ["taken", "late", "missed"], required: true },
    }
  ],
  deleted: {
    isDeleted: { type: Boolean, default: false },
    reason: { type: String }
  }
});


const Medicine = mongoose.model("Medicine", medicineSchema);

export { Medicine };
