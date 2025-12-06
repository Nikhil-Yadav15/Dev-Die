
import React, { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import { Edit, Trash2, Calendar, Clock, Pill } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const data = await getHistoryOfUser();
        setMedicines(data);
      } catch {
        setError("Failed to load medicines");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [getHistoryOfUser]);

  const getStatus = (medicine) => {
    const now = new Date();
    const start = new Date(medicine.startDate);
    const end = new Date(medicine.endDate);
    if (now >= start && now <= end) return "Active";
    if (now > end) return "Completed";
    return "Upcoming";
  };

  const StatusBadge = ({ status }) => {
    const lookup = {
      active: "bg-yellow-400 text-black shadow-lg",
      completed: "bg-gray-600 text-white",
      upcoming: "bg-blue-500 text-white",
    };
    const style = lookup[status.toLowerCase()] || lookup.upcoming;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${style}`}>
        {status}
      </span>
    );
  };

  const openEdit = (medicine) => {
    setEditing(medicine);
    setEditForm({
      name: medicine.name,
      frequencyPerDay: medicine.frequencyPerDay,
      times: medicine.times || [],
      startDate: medicine.startDate,
      endDate: medicine.endDate,
    });
  };

  const closeEditDialog = () => {
    setEditing(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTimeChange = (index, value) => {
    setEditForm((prev) => {
      const newTimes = [...(prev.times || [])];
      newTimes[index] = value;
      return { ...prev, times: newTimes };
    });
  };

  const submitEdit = async () => {
    if (!user) return alert("User not authenticated");
    try {
      setOperationLoading(true);
      await updateMedicine(editing._id, { ...editForm, userId: user._id || user.id });
      setMedicines(await getHistoryOfUser());
      closeEditDialog();
    } catch {
      alert("Failed to update medicine");
    } finally {
      setOperationLoading(false);
    }
  };

  const openDelete = (_id) => setDeleteId(_id);

  const confirmDelete = async () => {
    if (!user) return alert("User not authenticated");
    try {
      setOperationLoading(true);
      await deleteMedicine(deleteId, user._id || user.id);
      setDeleteId(null);
      setMedicines(await getHistoryOfUser());
    } catch {
      alert("Failed to delete medicine");
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading)
    return <div className="text-yellow-400 text-center mt-12 text-xl font-bold">Loading medicines...</div>;
  if (error) return <div className="text-red-500 text-center mt-12 text-xl font-bold">{error}</div>;

  if (!medicines || medicines.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1f]">
        <div className="bg-[#1f1f23] rounded-3xl shadow-2xl border border-yellow-400/30 px-12 py-12 max-w-xl w-full flex flex-col items-center transform hover:scale-105 transition">
          <Pill size={60} className="mb-4 text-yellow-400 drop-shadow-lg" />
          <h2 className="text-yellow-400 font-bold text-2xl mb-2 drop-shadow-lg">No medicines added yet</h2>
          <p className="text-gray-300 text-md text-center">
            Add your first medicine using the form to start tracking your doses.
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-6 sm:p-12 bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1f] min-h-screen">
      <h2 className="text-3xl font-bold text-yellow-400 mb-10 drop-shadow-lg text-center">Your Medicines</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {medicines.map((m) => (
          <div
            key={m._id}
            className="bg-[#1f1f23] border border-yellow-400/20 rounded-3xl shadow-2xl hover:shadow-[0_0_36px_#FFD700AA] p-6 flex flex-col transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl text-yellow-400 font-bold tracking-wide">{m.name}</h3>
              <div className="flex gap-2">
                <button
                  title="Edit"
                  onClick={() => openEdit(m)}
                  disabled={operationLoading}
                  className="rounded-lg p-2 hover:bg-yellow-500/20 transition"
                >
                  <Edit size={20} className="text-yellow-400" />
                </button>
                <button
                  title="Delete"
                  onClick={() => openDelete(m._id)}
                  disabled={operationLoading}
                  className="rounded-lg p-2 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={20} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <StatusBadge status={getStatus(m)} />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm text-gray-300 my-2">
              <span className="flex items-center gap-1">
                <Clock size={16} />{m.times?.map((t) => toLocalTimeString(t)).join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />Start: {format(new Date(m.startDate), "MMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />End: {format(new Date(m.endDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editing && (
        <Dialog open onClose={closeEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Medicine</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={editForm.name || ""}
              onChange={handleEditChange}
            />
            <TextField
              label="Frequency per Day"
              name="frequencyPerDay"
              type="number"
              fullWidth
              margin="normal"
              value={editForm.frequencyPerDay || 1}
              onChange={handleEditChange}
            />
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Times to take medicine
              </Typography>
              {editForm.times && editForm.times.map((time, idx) => (
                <TextField
                  key={idx}
                  type="time"
                  fullWidth
                  margin="normal"
                  value={time}
                  onChange={(e) => handleEditTimeChange(idx, e.target.value)}
                />
              ))}
            </div>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              margin="normal"
              value={toLocalDateInputValue(editForm.startDate)}
              onChange={(e) => handleEditChange({ target: { name: "startDate", value: e.target.value } })}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              margin="normal"
              value={toLocalDateInputValue(editForm.endDate)}
              onChange={(e) => handleEditChange({ target: { name: "endDate", value: e.target.value } })}
            />
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={closeEditDialog} disabled={operationLoading}>Cancel</MuiButton>
            <MuiButton onClick={submitEdit} disabled={operationLoading}>Save</MuiButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <Dialog open onClose={() => setDeleteId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this medicine?</Typography>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setDeleteId(null)} disabled={operationLoading}>Cancel</MuiButton>
            <MuiButton onClick={confirmDelete} color="error" disabled={operationLoading}>Delete</MuiButton>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
