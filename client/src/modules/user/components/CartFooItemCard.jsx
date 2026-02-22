
// export default CartFoodItemCard;
import { HiPlus, HiMinus} from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import VegIndicator from "./VegIndicator";
import { useOrder } from "../../../shared/store/order-context"; // 👈 IMPORT ORDER CONTEXT
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const CartFoodItemCard = ({ cartFoodItem , deleteFunction, loadingState, updateQuantity, totalQty }) => {

  const {_id, name, img, price, highlights,  dietaryType, availability, qty } = cartFoodItem;
  
  //  GET THE PENDING ORDER STATE
  const { orderDetails } = useOrder();
  
  //  CHECK IF THERE IS A PENDING ORDER
  const isPendingOrder = orderDetails && orderDetails.status === "CREATED";
  
  //  COMBINE LOADING AND PENDING STATE
  const isDisabled = loadingState || isPendingOrder;

  return (
    <div className="flex w-full gap-4 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">

      {/* Image Section */}
      <div className="relative w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-100">
        <img
          src={baseURL+"/uploads/"+img}
          alt={name}
          className="w-full h-full object-cover"
        />
        <VegIndicator type={ dietaryType} />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow pr-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-slate-900 text-lg leading-tight">
            {name}
          </h4>
          <span className="font-bold text-slate-900 ml-2">{availability ? `₹${price * qty}` : "Out of stock"}</span>
        </div>

        <p className="text-slate-400 text-xs mt-1 mb-2">{highlights.join(" •")}</p>

        {/* Bottom Row: Controls */}
        <div className="mt-auto flex justify-between items-center">

          {/* DELETE BUTTON (Left) */}
          <button 
          disabled={isDisabled}
          onClick={deleteFunction}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${isDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
            <MdDeleteOutline className="h-6 w-6" />
          </button>

          {/* QUANTITY Modifier at (Right) */}
          <div className="flex items-center border border-slate-200 rounded-full px-1 py-1 gap-2 shadow-sm bg-white">
            <button
              onClick={() => updateQuantity((_id.toString()),-1)}
              disabled={isDisabled || (!availability)|| (qty<=1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${isDisabled || (!availability) || (qty<=1) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <HiMinus size={14} />
            </button>

            <span className="font-bold text-sm text-slate-900 w-4 text-center">
              {availability ? qty : "-"}
            </span>

            <button
              onClick={() => updateQuantity((_id.toString()),+1)}
              disabled={isDisabled || (!availability) || (totalQty>=15)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${isDisabled || (!availability) || (totalQty>=15) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-orange-600'}`}>
              <HiPlus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartFoodItemCard;