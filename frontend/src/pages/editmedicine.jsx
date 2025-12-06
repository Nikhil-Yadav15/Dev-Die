import React, { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Edit, Trash2, Calendar, Clock, Pill } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

// Local time formatter similar to Dashboard
const toLocalTimeString = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const toLocalDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
};

export default function UserMedicinesManager() {
  const { user, getHistoryOfUser, updateMedicine, deleteMedicine } = useContext(AuthContext);

  const [medicines, setMedicines] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        setLoading(true);
        setMedicines(await getHistoryOfUser());
      } catch {
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, [getHistoryOfUser]);

  const getStatus = (m) => {
    const now = new Date();
    const start = new Date(m.startDate);
    const end = new Date(m.endDate);
    if (now >= start && now <= end) return "Active";
    if (now > end) return "Completed";
    return "Upcoming";
  };

  const statusStyles = {
    Active: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
    Completed: "bg-slate-700/40 text-gray-300 border border-slate-500/50",
    Upcoming: "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40",
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${statusStyles[status]}`}>
      {status}
    </span>
  );

  const openEdit = (m) => {
    setEditing(m);
    setEditForm({
      name: m.name,
      frequencyPerDay: m.frequencyPerDay,
      times: m.times || [],
      startDate: m.startDate,
      endDate: m.endDate,
    });
  };

  const confirmEdit = async () => {
    try {
      setOperationLoading(true);
      await updateMedicine(editing._id, { ...editForm, userId: user?._id });
      setMedicines(await getHistoryOfUser());
      setEditing(null);
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setOperationLoading(true);
      await deleteMedicine(deleteId, user?._id);
      setMedicines(await getHistoryOfUser());
      setDeleteId(null);
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-16 text-cyan-300 text-xl">Loading your medicines…</p>;

  return (
    <div
      className="min-h-screen p-6 sm:p-10 text-gray-100"
      style={{
        background:
          "radial-gradient(circle at 90% 10%, rgba(14,165,233,0.08) 0%, rgba(2,6,23,1) 40%, rgba(0,0,0,1) 100%)",
      }}
    >
      <h2 className="text-3xl font-semibold text-white text-center mb-10">
        Your Medicines
      </h2>

      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Pill size={60} className="mb-4 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-200 mb-2">Nothing added yet</h3>
          <p className="text-gray-400">Start by adding your first medicine.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {medicines.map((m) => (
            <div
              key={m._id}
              className="p-6 rounded-2xl backdrop-blur-lg border border-slate-700/60 
              bg-slate-950/80 shadow-[0_20px_60px_rgba(14,165,233,0.08)]
              hover:shadow-[0_25px_80px_rgba(14,165,233,0.15)]
              transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-white truncate">{m.name}</h3>
                <StatusBadge status={getStatus(m)} />
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-cyan-400" />
                  {m.times.map(toLocalTimeString).join(", ")}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-400" />
                  {format(new Date(m.startDate), "MMM dd")}
                  {" → "}
                  {format(new Date(m.endDate), "MMM dd")}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => openEdit(m)}
                  disabled={operationLoading}
                  className="p-2 rounded-lg hover:bg-cyan-400/20 bg-black transition text-cyan-300"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setDeleteId(m._id)}
                  disabled={operationLoading}
                  className="p-2 rounded-lg hover:bg-rose-500/20 transition text-rose-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT Dialog */}
      {editing && (
        <Dialog open onClose={() => setEditing(null)} fullWidth maxWidth="sm"
          PaperProps={{
            sx: {
              bgcolor: "#0a0f1a",
              border: "1px solid rgba(56,189,248,0.3)",
              borderRadius: "16px",
              color: "#e2e8f0",
            },
          }}
        >
          <DialogTitle>Edit Medicine</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              InputLabelProps={{ style: { color: "#94a3b8" } }}
              inputProps={{ style: { color: "#f1f5f9" } }}
            />
            <TextField
              label="Frequency"
              type="number"
              fullWidth
              margin="dense"
              value={editForm.frequencyPerDay}
              onChange={(e) => setEditForm({ ...editForm, frequencyPerDay: e.target.value })}
              InputLabelProps={{ style: { color: "#94a3b8" } }}
              inputProps={{ style: { color: "#f1f5f9" } }}
            />

            {editForm.times?.map((time, i) => (
              <TextField
                key={i}
                type="time"
                fullWidth
                margin="dense"
                value={time}
                onChange={(e) => {
                  const t = [...editForm.times];
                  t[i] = e.target.value;
                  setEditForm({ ...editForm, times: t });
                }}
                InputLabelProps={{ style: { color: "#94a3b8" } }}
                inputProps={{ style: { color: "#f1f5f9" } }}
              />
            ))}

            <TextField
              type="date"
              fullWidth
              margin="dense"
              label="Start Date"
              value={toLocalDateInputValue(editForm.startDate)}
              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
              InputLabelProps={{ shrink: true, style: { color: "#94a3b8" } }}
              inputProps={{ style: { color: "#f1f5f9" } }}
            />
            <TextField
              type="date"
              fullWidth
              margin="dense"
              label="End Date"
              value={toLocalDateInputValue(editForm.endDate)}
              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              InputLabelProps={{ shrink: true, style: { color: "#94a3b8" } }}
              inputProps={{ style: { color: "#f1f5f9" } }}
            />
          </DialogContent>

          <DialogActions>
            <button
              className="px-4 py-2 text-gray-300 hover:text-white"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-cyan-400 text-black hover:bg-cyan-300"
              onClick={confirmEdit}
              disabled={operationLoading}
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
      )}

      {/* DELETE Dialog */}
      {deleteId && (
        <Dialog open onClose={() => setDeleteId(null)}
          PaperProps={{
            sx: {
              bgcolor: "#0a0f1a",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "16px",
              color: "#e2e8f0",
            },
          }}
        >
          <DialogTitle>Delete Medicine?</DialogTitle>
          <DialogContent>
            Removing this will delete all future reminders.
          </DialogContent>
          <DialogActions>
            <button
              className="px-4 py-2 text-gray-300 hover:text-white"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-lg font-semibold bg-rose-500 text-white hover:bg-rose-400"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
