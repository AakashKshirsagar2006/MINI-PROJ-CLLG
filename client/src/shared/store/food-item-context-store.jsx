import { createContext, useEffect, useMemo, useState } from "react";
import fuzzySearch from "../utilities/string-matching-algorithm"; 

export const FoodItemsContext = createContext(null);

// SAFETY FIX: Hardcoded URL
const baseURL = "http://localhost:3000";

const FoodItemsContextProvider = ({children}) => {
  
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategory] = useState(['All Items','Fast Food', 'Full Meals','Indian Thali', 'Chinese','Italian', 'South Indian', 'Deserts', 'Healthy','Not Available']);

  useEffect(() => {
    fetch(baseURL + "/food-items")
    .then(res => res.json())
    .then(fi => {
      // Safety check in case backend response structure varies
      const items = fi.foodItems || []; 
      setFoodItems(items);
    }).catch(err => console.log(err));

  }, []);

  const foodItemsByCategory = {};
  
  // Initialize categories
  foodCategories.forEach(category => {
    foodItemsByCategory[category] = [];
  });

  // Sort items into categories
  foodItems.forEach(foodItem => {
    if (!foodItemsByCategory[foodItem.type]) {
       // If a new category appears from DB that isn't in the hardcoded list
       foodItemsByCategory[foodItem.type] = [];
    }
    foodItemsByCategory[foodItem.type].push(foodItem);
  });

  // SEARCH LOGIC
  const dynamicSearchFilteration = (itemsToFilter, staticSearchFilter = "BY NAME", dynamicSearchFilter) => {
    if(staticSearchFilter === "BY NAME" && dynamicSearchFilter.length >= 3){
      // Calls the utility we are about to create
      const result = fuzzySearch(dynamicSearchFilter, itemsToFilter, 40, "by_name").map((element) => {
          return element.foodItem;
      });
      return result;
    }
    else if(staticSearchFilter === "BY ID" && dynamicSearchFilter.length > 3){
        return fuzzySearch(dynamicSearchFilter, itemsToFilter, 80, "by_id").map((element) => {
          return element.foodItem;
        });
    }
    else{
        return itemsToFilter;
    }
  }

  const value = useMemo(() => ({
    foodItems,
    foodItemsByCategory,
    foodCategories,
    dynamicSearchFilteration
  }), [foodItems, foodCategories]); // Added foodCategories to dependency array

  // CRITICAL FIX: Added .Provider
  return (
    <FoodItemsContext.Provider value={value}>
      {children}
    </FoodItemsContext.Provider>
  )
}

export default FoodItemsContextProvider;