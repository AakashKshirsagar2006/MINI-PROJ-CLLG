import React, { useState } from 'react';
import { IoAddCircleSharp, IoRemove, IoAdd } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import VegIndicator from './VegIndicator';
import { useOrder } from '../../../shared/store/order-context';
import { useCart } from '../../../shared/store/cart-context';
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const MenuFoodItemCard = ({ foodItem}) => {
  const {items, loading, addToCart } = useCart();
   const itemsInCart = Object.keys(items);
  const isInCart = itemsInCart.includes(foodItem._id.toString());
  const {orderDetails} = useOrder();
  const buttonDisability = !(!orderDetails)||(!foodItem.availability) || isInCart || loading;
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

          {/*  Tags */}
          {foodItem.tag && <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide shadow-md shadow-orange-500/20">
            {foodItem.tag}
          </div>
            }
        </div>

        {/* Content Section */}
        <div className="pt-4 px-2 pb-2 flex flex-col grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{foodItem.name}</h3>
            <span className="font-bold text-slate-900 text-lg">{foodItem.availability ? `₹${foodItem.price}` : "Not Available"}</span>
          </div>

          <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
            {"•" + foodItem.highlights.join(" •")}
          </p>

          <div className="mt-auto">
            <button
              disabled={buttonDisability}
              onClick={() => addToCart(foodItem._id.toString())}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 group/btn"
            >
              <>
                {isInCart ? (
                  <IoIosCheckmarkCircle className="text-xl text-green-500" />
                ) : (
                  <IoAddCircleSharp className="text-xl" />
                )}
                {isInCart ? "Added" : "Add to Cart"}
              </>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuFoodItemCard;