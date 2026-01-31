import React from "react";

const VegIndicator = ({ type }) => {
  const isVeg = type?.toLowerCase() === "veg";

  return (
    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
      <div
        className={`w-4 h-4 border-2 flex items-center justify-center ${
          isVeg ? "border-green-600" : "border-red-600"
        }`}
        aria-label={isVeg ? "Vegetarian item" : "Non-vegetarian item"}
        role="img"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isVeg ? "bg-green-600" : "bg-red-600"
          }`}
        />
      </div>
    </div>
  );
};

export default VegIndicator;
