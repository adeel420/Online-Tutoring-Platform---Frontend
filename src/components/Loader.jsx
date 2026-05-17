import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ size = 40, color = "#7c3aed", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ClipLoader size={size} color={color} />
          <p className="text-sm font-medium text-purple-700">Please wait...</p>
        </div>
      </div>
    );
  }

  return <ClipLoader size={size} color={color} />;
};

export default Loader;
