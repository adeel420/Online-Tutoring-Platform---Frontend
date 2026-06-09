import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {
  formatDateLabel,
  formatTimeRange12,
  getDayFromDate,
  getTodayDate,
} from "../../utils/time";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultForm = { date: getTodayDate(), day: getDayFromDate(getTodayDate()), from: "09:00", to: "10:00" };

const Availability_Schedule = () => {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/user/login-detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlots(data.availabilitySlots || []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Could not load availability.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [apiUrl, token]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveSlots = async (nextSlots, successMessage) => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${apiUrl}/user/tutor/availability`,
        { slots: nextSlots },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSlots(data.availabilitySlots || []);
      toast.success(successMessage);
    } catch (err) {
      toast.error(err.response?.data?.error || "Availability update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!form.date || !form.from || !form.to) {
      toast.error("Please complete the slot.");
      return;
    }

    if (form.date < getTodayDate()) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (form.from >= form.to) {
      toast.error("End time must be after start time.");
      return;
    }

    const slotForm = { ...form, day: getDayFromDate(form.date) };
    const nextSlots =
      editId !== null
        ? slots.map((s) => (s._id === editId ? { ...s, ...slotForm } : s))
        : [...slots, { ...slotForm, isBooked: false }];

    saveSlots(nextSlots, editId !== null ? "Slot updated." : "Slot added.");
    setForm(defaultForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (slot) => {
    setForm({
      date: slot.date || getTodayDate(),
      day: slot.day || getDayFromDate(slot.date),
      from: slot.from,
      to: slot.to,
    });
    setEditId(slot._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const slot = slots.find((s) => s._id === id);
    if (slot?.isBooked) {
      toast.error("Booked slots cannot be deleted.");
      return;
    }
    saveSlots(slots.filter((s) => s._id !== id), "Slot deleted.");
  };

  const openAddForm = () => {
    setShowForm(true);
    setEditId(null);
    setForm(defaultForm);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Availability Calendar</h3>
          <p className="text-sm text-gray-500">
            {slots.filter((slot) => !slot.isBooked).length} open slots,{" "}
            {slots.filter((slot) => slot.isBooked).length} booked
          </p>
        </div>
        <button
          onClick={openAddForm}
          disabled={saving}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
        >
          + Add Slot
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
          <h4 className="font-bold text-gray-800 mb-4">
            {editId ? "Edit Time Slot" : "Add New Time Slot"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                min={getTodayDate()}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-xs text-gray-400 mt-1">{getDayFromDate(form.date)}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">From</label>
              <input
                type="time"
                name="from"
                value={form.from}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">To</label>
              <input
                type="time"
                name="to"
                value={form.to}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? "Saving..." : editId ? "Update Slot" : "Add Slot"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              disabled={saving}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DAYS.map((day) => {
          const daySlots = slots
            .filter((s) => s.day === day)
            .sort((a, b) => `${a.date} ${a.from}`.localeCompare(`${b.date} ${b.from}`));
          return (
            <div
              key={day}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                daySlots.length > 0 ? "border-purple-100" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    daySlots.length > 0 ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <p className="font-semibold text-gray-800 text-sm">{day}</p>
                {daySlots.length === 0 && (
                  <span className="text-xs text-gray-400 ml-auto">No slots</span>
                )}
              </div>
              {daySlots.length > 0 && (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                        slot.isBooked
                          ? "bg-gray-50"
                          : "bg-gradient-to-r from-purple-50 to-blue-50"
                      }`}
                    >
                      <div>
                        <span
                          className={`text-sm font-semibold ${
                            slot.isBooked ? "text-gray-500" : "text-purple-700"
                          }`}
                        >
                          {formatDateLabel(slot.date)}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {formatTimeRange12(slot.from, slot.to)}
                        </span>
                        {slot.isBooked && (
                          <span className="ml-2 text-xs font-semibold text-blue-600">
                            Booked
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(slot)}
                          disabled={saving || slot.isBooked}
                          className="px-2.5 py-1 bg-white text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-50 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slot._id)}
                          disabled={saving || slot.isBooked}
                          className="px-2.5 py-1 bg-white text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Availability_Schedule;
