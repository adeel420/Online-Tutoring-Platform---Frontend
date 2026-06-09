import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDownload, FaFilePdf, FaImage, FaVideo } from "react-icons/fa";
import Loader from "../Loader";

const typeIcon = {
  PDF: FaFilePdf,
  Video: FaVideo,
  Image: FaImage,
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const Learning_Materials = () => {
  const [materials, setMaterials] = useState([]);
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

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Learning Materials</h3>
          <p className="text-sm text-gray-500">
            {materials.length} files uploaded through chats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => {
          const Icon = typeIcon[material.type] || FaDownload;
          return (
            <div key={material.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-xl text-purple-700 flex-shrink-0">
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{material.name}</p>
                  <p className="text-xs text-gray-400">{material.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{material.subject}</span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{material.type}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Sent to {material.student}</p>
              <p className="text-xs text-gray-400 mb-3">Uploaded: {formatDate(material.uploaded)}</p>
              <a
                href={material.url}
                download={material.name}
                target="_blank"
                rel="noreferrer"
                className="w-full px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg text-xs font-semibold hover:from-purple-200 hover:to-blue-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FaDownload /> Download
              </a>
            </div>
          );
        })}
      </div>

      {materials.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm">No materials uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default Learning_Materials;
