import React, { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialSlots = [
  { id: 1, day: "Monday", from: "09:00", to: "11:00" },
  { id: 2, day: "Wednesday", from: "14:00", to: "16:00" },
  { id: 3, day: "Friday", from: "10:00", to: "12:00" },
];

const Availability_Schedule = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [form, setForm] = useState({ day: "Monday", from: "09:00", to: "10:00" });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (editId !== null) {
      setSlots((p) => p.map((s) => (s.id === editId ? { ...s, ...form } : s)));
      setEditId(null);
    } else {
      setSlots((p) => [...p, { id: Date.now(), ...form }]);
    }
    setForm({ day: "Monday", from: "09:00", to: "10:00" });
    setShowForm(false);
  };

  const handleEdit = (slot) => {
    setForm({ day: slot.day, from: slot.from, to: slot.to });
    setEditId(slot.id);
    setShowForm(true);
  };

  const handleDelete = (id) => setSlots((p) => p.filter((s) => s.id !== id));

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Weekly Availability</h3>
          <p className="text-sm text-gray-500">{slots.length} time slots configured</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ day: "Monday", from: "09:00", to: "10:00" }); }}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          + Add Slot
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
          <h4 className="font-bold text-gray-800 mb-4">{editId ? "Edit Time Slot" : "Add New Time Slot"}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Day</label>
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
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
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              {editId ? "Update Slot" : "Add Slot"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DAYS.map((day) => {
          const daySlots = slots.filter((s) => s.day === day);
          return (
            <div key={day} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${daySlots.length > 0 ? "border-purple-100" : "border-gray-100"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${daySlots.length > 0 ? "bg-green-500" : "bg-gray-300"}`} />
                <p className="font-semibold text-gray-800 text-sm">{day}</p>
                {daySlots.length === 0 && <span className="text-xs text-gray-400 ml-auto">No slots</span>}
              </div>
              {daySlots.length > 0 && (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl px-3 py-2">
                      <span className="text-sm font-semibold text-purple-700">
                        {slot.from} — {slot.to}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="px-2.5 py-1 bg-white text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-50 transition-all cursor-pointer shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="px-2.5 py-1 bg-white text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer shadow-sm"
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
