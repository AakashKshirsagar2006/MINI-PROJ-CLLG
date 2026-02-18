import { useContext } from "react";
import { FoodItemsContext } from "../store/food-item-context-store";

export const useFoodItems = () => {
  const ctx = useContext(FoodItemsContext);
  if(!ctx) throw new Error("useFoodItems must be used inside the FoodItemsContextProvider");
  return ctx;
}