import React, { useState } from "react";
import { tutorMaterials } from "../../data/Data";

const Learning_Materials = () => {
  const [materials, setMaterials] = useState(tutorMaterials);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "Mathematics", type: "PDF" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpload = () => {
    if (!form.name.trim()) return;
    const newMaterial = {
      id: Date.now(),
      name: form.name,
      type: form.type,
      size: "1.2 MB",
      subject: form.subject,
      uploaded: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    setMaterials((p) => [newMaterial, ...p]);
    setForm({ name: "", subject: "Mathematics", type: "PDF" });
    setShowUpload(false);
  };

  const handleDelete = (id) => setMaterials((p) => p.filter((m) => m.id !== id));

  const typeIcon = {
    PDF: "📄",
    Video: "🎥",
    Image: "🖼️",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Learning Materials</h3>
          <p className="text-sm text-gray-500">{materials.length} files uploaded</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          + Upload File
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">
          <h4 className="font-bold text-gray-800 mb-4">Upload New Material</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">File Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Chapter 1 Notes.pdf"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option>PDF</option>
                <option>Video</option>
                <option>Image</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUpload}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              Upload
            </button>
            <button
              onClick={() => { setShowUpload(false); setForm({ name: "", subject: "Mathematics", type: "PDF" }); }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => (
          <div key={mat.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {typeIcon[mat.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{mat.name}</p>
                <p className="text-xs text-gray-400">{mat.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{mat.subject}</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{mat.type}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Uploaded: {mat.uploaded}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg text-xs font-semibold hover:from-purple-200 hover:to-blue-200 transition-all cursor-pointer">
                Download
              </button>
              <button
                onClick={() => handleDelete(mat.id)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-3">📚</div>
          <p className="text-gray-400 text-sm">No materials uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default Learning_Materials;
