import { IoFastFoodOutline } from "react-icons/io5";

const NoFoodMessage = ({ variant = "carousel" }) => {
  
  const baseStyles = "flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 select-none text-slate-400";

 
  const variantStyles = {
    carousel: "snap-center shrink-0 w-[280px] md:w-[320px] min-h-[350px]",
    
    menu: "w-full col-span-full min-h-[400px]"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      
      {/* Icon Circle */}
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
        <IoFastFoodOutline size={40} />
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-slate-700">
        No items found
      </h3>
      
      <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-[200px]">
        There are no food items available in this category right now.
      </p>

    </div>
  );
};

export default NoFoodMessage;