import express from 'express';
import cors from 'cors';

import mongoose from "mongoose";
import router from "./routes/user.js";
import dotenv from "dotenv";

import "./controllers/user.controller.js";




dotenv.config();


const app = express();


app.set("port", (process.env.PORT || 3000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));



app.get('/home', (req, res) => {
    res.send('Hello World!');
});

app.use("/", router);

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);


    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};




start();