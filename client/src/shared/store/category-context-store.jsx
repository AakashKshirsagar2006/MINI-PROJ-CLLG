import { Children, createContext, useState } from "react";

export const FoodCategoryContext = createContext({
  categoryState:"",
  setCategoryState:()=>{}
});



const FoodCategoryContextProvider = ({children})=>{
const [categoryState, setCategoryState] = useState("All Items");
return (
  <FoodCategoryContext.Provider value={{categoryState,setCategoryState}}>{children}</FoodCategoryContext.Provider>
)
}

export default FoodCategoryContextProvider;