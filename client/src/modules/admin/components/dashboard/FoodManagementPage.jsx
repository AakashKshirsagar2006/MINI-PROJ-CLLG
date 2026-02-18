import { useState, useRef } from "react";
import { AddNewFoodItem, UpdateFoodItem } from "./components/FoodManagementElements"; 
// Make sure path is correct

const FoodManagementPage = ({pageState}) => {
  
  return (
    <div className="p-6 md:p-10 max-w-full mx-auto">
     
      {/* <AddNewFoodItem/> */}
    {pageState==="ADD"?<AddNewFoodItem/>:<UpdateFoodItem formState={pageState}/>}
    </div>
  );
};

export default FoodManagementPage;