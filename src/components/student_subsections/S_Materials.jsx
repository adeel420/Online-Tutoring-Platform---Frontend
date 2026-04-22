import React, { useState } from "react";
import { studentMaterials } from "../../data/Data";

const typeIcon = { PDF: "📄", Video: "🎥", Image: "🖼️" };
const typeColor = { PDF: "bg-red-50 text-red-600", Video: "bg-blue-50 text-blue-600", Image: "bg-green-50 text-green-600" };

const S_Materials = () => {
  const [filter, setFilter] = useState("all");
  const subjects = ["all", ...new Set(studentMaterials.map((m) => m.subject))];

  const filtered = filter === "all" ? studentMaterials : studentMaterials.filter((m) => m.subject === filter);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Files", value: studentMaterials.length, icon: "📁", color: "from-purple-500 to-blue-500" },
          { label: "PDFs", value: studentMaterials.filter((m) => m.type === "PDF").length, icon: "📄", color: "from-red-500 to-rose-500" },
          { label: "Videos", value: studentMaterials.filter((m) => m.type === "Video").length, icon: "🎥", color: "from-blue-500 to-cyan-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center text-lg shadow`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subject Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              filter === s
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mat) => (
          <div key={mat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {typeIcon[mat.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-snug">{mat.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{mat.size}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{mat.subject}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColor[mat.type]}`}>{mat.type}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">By {mat.tutor}</p>
                <p className="text-xs text-gray-400">{mat.date}</p>
              </div>
            </div>

            <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer">
              ⬇️ Download
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-3">📚</div>
          <p className="text-gray-400 text-sm">No materials found for this subject</p>
        </div>
      )}
    </div>
  );
};

export default S_Materials;
