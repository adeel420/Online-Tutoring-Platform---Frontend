import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDownload, FaFilePdf, FaImage, FaVideo } from "react-icons/fa";
import Loader from "../Loader";

const typeIcon = {
  PDF: FaFilePdf,
  Video: FaVideo,
  Image: FaImage,
};

const typeColor = {
  PDF: "bg-red-50 text-red-600",
  Video: "bg-blue-50 text-blue-600",
  Image: "bg-green-50 text-green-600",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const S_Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    axios
      .get(`${apiUrl}/realtime/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setMaterials(Array.isArray(data) ? data : []))
      .catch((err) => {
        toast.error(err.response?.data?.error || "Could not load materials.");
      })
      .finally(() => setLoading(false));
  }, [apiUrl, token]);

  const subjects = useMemo(
    () => ["all", ...new Set(materials.map((material) => material.subject))],
    [materials],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? materials
        : materials.filter((material) => material.subject === filter),
    [filter, materials],
  );

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Files", value: materials.length, icon: <FaDownload />, color: "from-purple-500 to-blue-500" },
          { label: "PDFs", value: materials.filter((m) => m.type === "PDF").length, icon: <FaFilePdf />, color: "from-red-500 to-rose-500" },
          { label: "Videos", value: materials.filter((m) => m.type === "Video").length, icon: <FaVideo />, color: "from-blue-500 to-cyan-500" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white shadow`}>
              {icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setFilter(subject)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              filter === subject
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((material) => {
          const Icon = typeIcon[material.type] || FaDownload;
          return (
            <div key={material.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-xl text-purple-700 flex-shrink-0">
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{material.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{material.size}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{material.subject}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColor[material.type]}`}>{material.type}</span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500">By {material.tutor}</p>
                <p className="text-xs text-gray-400">{formatDate(material.uploaded)}</p>
              </div>

              <a
                href={material.url}
                download={material.name}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FaDownload /> Download
              </a>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm">No materials found.</p>
        </div>
      )}
    </div>
  );
};

export default S_Materials;
