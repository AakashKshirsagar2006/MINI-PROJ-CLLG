import React from "react";
import { IoTriangle } from "react-icons/io5";

const VegIndicator = ({ type }) => {
  const lowerType = type?.toLowerCase();
  
  const isVeg = lowerType === "veg";
  const isEgg = lowerType === "egg";


  const colorClass = isVeg 
    ? "border-green-600 fill-green-600 bg-green-600" 
    : isEgg 
      ? "border-amber-900 fill-amber-900 bg-amber-900" 
      : "border-red-600 fill-red-600 bg-red-600";

  return (
    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm">
      <div
        className={`w-4 h-4 border-2 flex items-center justify-center ${colorClass.split(' ')[0]}`}
        aria-label={`${type} item`}
        role="img"
      >
        {isEgg ? (
          <IoTriangle  className={`w-2 h-2 ${colorClass.split(' ')[1]}`}/>
          
        ) : (
          <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[2]}`} />
        )}
      </div>
    </div>
  );
};

export default VegIndicator;