import { createContext, useEffect, useMemo, useState } from "react";

export const FoodItemsContext = createContext(null)

const FoodItemsContextProvider = ({children})=>{
  

  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategory] = useState(['All Items','Fast Food', 'Full Meals','Indian Thali', 'Chinese','Italian', 'South Indian', 'Deserts', 'Healthy','Not Available']);

  useEffect(()=>{
    // const controller = new AbortController();
    // const signal = controller.signal;

    fetch("http://localhost:3000/food-items")
    .then(res=>res.json())
    .then(fi=>{
      const {foodItems} = fi; 
     setFoodItems(foodItems);
    }).catch(err=> console.log(err));

  },[]);

  const foodItemsByCategory = {};
  foodCategories.forEach(category=>{
    foodItemsByCategory[category] = [];
  });

  foodItems.forEach(foodItem=>{
    if (!foodItemsByCategory[foodItem.type]) {
      foodItemsByCategory[foodItem.type] = [];
    }
    foodItemsByCategory[foodItem.type].push(foodItem);
  })

  const value = useMemo(()=>({
    foodItems,
    foodItemsByCategory,
    foodCategories
  }),[foodItems]);

return (<FoodItemsContext value={value}>
    {children}
  </FoodItemsContext>)
}



export default FoodItemsContextProvider;