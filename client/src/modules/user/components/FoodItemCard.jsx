//For Home page display
import { IoAddCircleSharp } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import VegIndicator from "./VegIndicator";
import { useCart } from "../../../shared/store/cart-context";
import { useOrder } from "../../../shared/store/order-context";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;


const FoodItemCard = ({ foodItem}) => {
  const {items, loading, addToCart } = useCart();
   const itemsInCart = Object.keys(items);
 
  const isInCart = itemsInCart.includes(foodItem._id.toString());
  const {orderDetails} = useOrder();
  const buttonDisability = !(!orderDetails)||(!foodItem.availability) || itemsInCart.includes(foodItem._id.toString()) || loading;

  return (
    <>
      {/* For Carousel */}
      <div className="snap-center shrink-0 w-[280px] md:w-[320px] bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition duration-300 group">
        <div className="h-48 rounded-[1.5rem] overflow-hidden relative mb-4">


          <img src={baseURL+"/uploads/"+foodItem.img} alt="Pizza" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />

          {/* Veg Non-Veg Icon */}
          <VegIndicator type={foodItem. dietaryType} />

          {/* tags */}
          {foodItem.tag && <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide shadow-md shadow-orange-500/20">
            {foodItem.tag}
          </div>}


        </div>

        {/* name */}
        <h3 className="text-xl font-bold text-slate-900 px-1">{foodItem.name}</h3>


        <p className="text-slate-500 text-sm mt-1 px-1">{foodItem.highlights.join(" • ")}</p>

        <div className="flex justify-between items-center mt-4 px-1">

          <span className="text-lg font-bold text-slate-900">₹{foodItem.price}</span>

          <button
            disabled={buttonDisability}
            onClick={() => addToCart(foodItem._id.toString())}
            className=
            "flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/50 transform active:scale-95">
            <span className="flex items-center gap-1">
              <>
                {isInCart ? (
                  <IoIosCheckmarkCircle className="text-xl text-green-500" />
                ) : (
                  <IoAddCircleSharp className="text-xl" />
                )}
                {isInCart ? "Added" : "Add to Cart"}
              </>

            </span>

          </button>
        </div>
      </div>
    </>
  )
}

export default FoodItemCard;