import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function MedicineForm({ initialData = {}, isEditing = false }) {
  const { medicine, user } = useContext(AuthContext);

  const getLocalDateString = () => {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    frequencyPerDay: initialData.frequencyPerDay || 1,
    times: initialData.times || [""],
    startDate: initialData.startDate || getLocalDateString(),
    endDate: initialData.endDate || getLocalDateString(),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // keep times array in sync with frequency
  useEffect(() => {
    const freq = parseInt(formData.frequencyPerDay, 10) || 1;
    setFormData((prev) => {
      let newTimes = [...prev.times];
      if (newTimes.length < freq) {
        newTimes = [...newTimes, ...Array(freq - newTimes.length).fill("")];
      } else if (newTimes.length > freq) {
        newTimes = newTimes.slice(0, freq);
      }
      return { ...prev, times: newTimes, frequencyPerDay: freq };
    });
  }, [formData.frequencyPerDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "frequencyPerDay") {
      let val = parseInt(value, 10);
      if (isNaN(val) || val < 1) val = 1;
      else if (val > 10) val = 10;
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTimeChange = (index, value) => {
    setFormData((prev) => {
      const newTimes = [...prev.times];
      newTimes[index] = value;
      return { ...prev, times: newTimes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userId = user?.id || localStorage.getItem("userId") || "";

    for (let i = 0; i < formData.times.length; i++) {
      if (!formData.times[i]) {
        setError(`Please enter time for dose ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Start date and end date are required");
      setLoading(false);
      return;
    }

    try {
      await medicine(
        userId,
        formData.name,
        formData.frequencyPerDay,
        formData.times,
        formData.startDate,
        formData.endDate
      );
      if (!isEditing) {
        setFormData({
          name: "",
          frequencyPerDay: 1,
          times: [""],
          startDate: getLocalDateString(),
          endDate: getLocalDateString(),
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-slate-950/90 border border-cyan-400/30 
      rounded-2xl shadow-[0_24px_70px_rgba(15,23,42,1)] 
      p-6 sm:p-8 space-y-6 text-gray-100"
    >
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          {isEditing ? "Edit Medicine" : "Add New Medicine"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Configure how often and when this medicine should be taken.
        </p>
      </div>

      {/* Medicine Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-xs sm:text-sm text-gray-300">
          Medicine Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Metformin 500mg"
          required
          className="w-full px-3 py-2.5 rounded-lg bg-black/40 text-gray-100 
          placeholder-gray-500 border border-slate-700
          focus:outline-none focus:border-cyan-400 focus:ring-0 text-sm"
        />
      </div>

      {/* Frequency */}
      <div className="space-y-1.5">
        <label
          htmlFor="frequencyPerDay"
          className="block text-xs sm:text-sm text-gray-300"
        >
          Number of times per day
        </label>
        <input
          id="frequencyPerDay"
          name="frequencyPerDay"
          type="number"
          min={1}
          max={10}
          value={formData.frequencyPerDay}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 rounded-lg bg-black/40 text-gray-100 
          border border-slate-700 focus:outline-none 
          focus:border-cyan-400 focus:ring-0 text-sm"
        />
        <p className="text-[11px] text-gray-500">
          You can schedule up to 10 doses per day.
        </p>
      </div>

      {/* Times */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm text-gray-300">
          Time(s) to take medicine
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {formData.times.map((time, idx) => (
            <input
              key={idx}
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(idx, e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-black/40 text-gray-100 
              border border-slate-700 focus:outline-none 
              focus:border-cyan-400 focus:ring-0 text-sm"
              aria-label={`Time for dose ${idx + 1}`}
            />
          ))}
        </div>
        <p className="text-[11px] text-gray-500">
          Set the specific times for each dose throughout the day.
        </p>
      </div>

      {/* Start Date */}
      <div className="space-y-1.5">
        <label
          htmlFor="startDate"
          className="block text-xs sm:text-sm text-gray-300"
        >
          Start Date
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 rounded-lg bg-black/40 text-gray-100 
          border border-slate-700 focus:outline-none 
          focus:border-cyan-400 focus:ring-0 text-sm"
        />
      </div>

      {/* End Date */}
      <div className="space-y-1.5">
        <label
          htmlFor="endDate"
          className="block text-xs sm:text-sm text-gray-300"
        >
          End Date
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 rounded-lg bg-black/40 text-gray-100 
          border border-slate-700 focus:outline-none 
          focus:border-cyan-400 focus:ring-0 text-sm"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold
        bg-gradient-to-r from-cyan-500 to-emerald-400
        text-slate-950
        shadow-[0_18px_40px_rgba(34,197,94,0.45)]
        hover:from-cyan-400 hover:to-emerald-300
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all"
      >
        {loading ? "Saving..." : isEditing ? "Update Medicine" : "Add Medicine"}
      </button>

      {error && (
        <div className="text-rose-400 text-xs sm:text-sm text-center mt-2">
          {error}
        </div>
      )}
    </form>
  );
}
