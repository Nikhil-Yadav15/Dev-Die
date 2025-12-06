import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, minlength: 6 },
   googleId: { type: String },
  token: { type: String },
});

const User = mongoose.model("User", userSchema);
export { User };
