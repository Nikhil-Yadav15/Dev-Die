import { Medicine } from "../models/medicine.model.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  "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";

const GROQ_MODEL = "llama-3.1-8b-instant";

export const chatbotHandler = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ success: false, reply: "Message and userId required." });
  }

  try {
    // Fetch medicines & notifications for user
    const medicines = await Medicine.find({ userId });
    const notifications = await Notification.find({ userId });

    // Use local date 'YYYY-MM-DD' format for today's filter
    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // e.g. '2025-10-11'

    // Filter upcoming doses for today and sort ascending by scheduledTime
    const nextDoseToday = medicines
      .filter(med => med.date === today && !med.taken)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
      .slice(0, 10); // limit recent to 10 for prompt size

    // Limit recent notifications for prompt size
    const recentNotifications = notifications.slice(-5);

    // System prompt informing bot about doses and notifications
    const systemPrompt = `
You are a helpful medicine schedule assistant.
Guidelines:
- Always reply in medium (3-5 sentences) friendly answers unless user asks for more detail.
- If user asks for "next dose", "upcoming dose", or "when/what is my next medicine", answer *only* with the next scheduled dose for today from: ${JSON.stringify(nextDoseToday[0] || {})}. Do not list the whole day.
- If user says "what are my next doses" or "what's left today", reply with a list of all remaining doses for today: ${JSON.stringify(nextDoseToday)}.
- Only show the full day's schedule if user explicitly asks for it ("all doses today", etc).
- If user says "hello" or greets, respond warmly.
- Never ask user to repeat info; use only data provided above in context.
- Always be clear, kind, and concise.
`;

    const payload = {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    };

    const response = await axios.post(GROQ_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      timeout: 15000,
    });

    const reply = response.data?.choices?.[0]?.message?.content || "Sorry, I couldn't get an answer right now.";

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Groq API / network error:", error?.response?.data || error.message);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error?.response?.data || error.message
        : "I'm having trouble connecting to the AI right now. Please try again later.";

    res.json({ success: false, reply: errorMessage });
  }
};
