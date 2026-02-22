import { useRef, useState } from "react";
// VegIndicator should exist in your User module
import VegIndicator from "../../user/components/VegIndicator"; 
import { IoIosCheckmarkCircle } from "react-icons/io";
import useAdminAction from "../../../shared/hooks/useAdminAction";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const AdminFoodStockCard = ({foodItem,loadingState,handleApplyChanges}) => {
  const quantityRef = useRef(foodItem.quantity);
  const [availability, setAvailability] = useState(foodItem.availability);
 
  // const handleApplyChanges = async () => {
  //   const quantity = quantityRef.current.value;
  //   const id = foodItem._id.toString();
  //   const res = await quickStockActions(id, quantity, availability);
  //   if(res) triggerNotification("Successfully applied changes","success");
  //   else{
  //     triggerNotification("Failed to apply changes","error");
  //   }
  // }

  return (
    <>
      <div className="bg-white p-3 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition duration-300 group flex flex-col h-full">

        {/* Image Section */}
        <div className="relative h-48 shrink-0 rounded-3xl overflow-hidden bg-slate-100">
          <img
            src={baseURL+"/uploads/"+foodItem.img}
            alt={foodItem.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          {/* Veg/Non-Veg Icon */}
          <VegIndicator type={foodItem.dietaryType} />

          {/* Tags */}
          {foodItem.tag && <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide shadow-md shadow-orange-500/20">
            {foodItem.tag}
          </div>}

        </div>

        {/* Content Section */}
        <div className="pt-5 px-1 flex flex-col grow">
        
        {/* Header: Name & Price */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-slate-800 text-xl leading-tight tracking-tight pr-2">
            {foodItem.name}
          </h3>
          <span className="font-extrabold text-slate-800 text-xl whitespace-nowrap">
            ₹{foodItem.price}
          </span>
        </div>

        {/* Attribute Grid */}
        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2">
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">UID</span>
            <span className="text-sm font-semibold text-slate-700 capitalize truncate">{foodItem.itemUID}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Type</span>
            <span className="text-sm font-semibold text-slate-700 capitalize truncate">{foodItem.category}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Diet</span>
            <span className="text-sm font-semibold text-slate-700 capitalize truncate">{foodItem. dietaryType}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tag</span>
            <span className="text-sm font-semibold text-slate-700 capitalize truncate">{foodItem.tag?foodItem.tag:"---"}</span>
          </div>

          <div className="flex flex-col col-span-2">
             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Highlights</span>
             <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-1">
              {foodItem.highlights ? foodItem.highlights.join(" • ") : ""}
            </p>
          </div>
        </div>

      </div>
          {/* Quantity Modifyer */}
         <div className="pt-4 px-2 pb-2 flex flex-col grow">
          <div className="mt-auto flex items-center gap-12">

            {/* Quantity Input */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quantity
              </span>
              <input
                min={1}
                max={1000}
                ref={quantityRef}
                type="number"
                disabled={loadingState}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition shadow-sm"
                placeholder="Qty"
                defaultValue={foodItem.quantity}
              />
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col items-center gap-2 w-24 shrink-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${availability ? "text-green-600" : "text-slate-400"}`}>
                {availability ? "In Stock" : "Out of Stock"}
              </span>
              <button
                onClick={() => {
                  if (availability) {
                    setAvailability(false);
                    quantityRef.current.value = 0;
                  }
                  else {
                    setAvailability(true);
                    quantityRef.current.value = foodItem.quantity;
                  }
                }}
                disabled={loadingState}
                className={`w-16 h-9 rounded-full p-1 transition-colors duration-300 flex items-center ${availability ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <div className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${availability ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>

          <div className="mt-6">
            <button
              disabled={loadingState}
              onClick={()=> handleApplyChanges(foodItem._id.toString(), quantityRef.current.value, availability)}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 group/btn"
            >
              Apply Changes
              <IoIosCheckmarkCircle className="text-xl text-green-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminFoodStockCard;