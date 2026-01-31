import React, { useState } from 'react';
import MenuFoodItemCard from '../components/MenuFoodItemCard';
import CategorySelector from '../components/CategorySelector';
import { FoodItemsContext } from '../../../shared/store/food-item-context-store';
import { useContext } from 'react';
import { FoodCategoryContext } from '../../../shared/store/category-context-store';
import { useCart } from '../../../shared/store/cart-context';
import { useFoodItems } from '../../../shared/hooks/useFoodItems';
import NoFoodMessage from '../components/NoFoodMessage';

const MenuPage = () => {
  // Mock state for category selection
  
  const {items,loading,addToCart}=useCart();
  const itemsInCart=items ? Object.keys(items) : [];
  const [activeCategory, setActiveCategory] = useState('All');
   
  const { foodItemsByCategory, foodCategories, foodItems } = useFoodItems();
  const { categoryState} = useContext(FoodCategoryContext);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">

      {/* ================================================================
        COMPONENT: HEADER & SEARCH
        ================================================================ 
      */}
      {/* (Assuming Header code exists here based on previous context) */}


      <main className="max-w-8xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* ================================================================
           TOP CONTROLS SECTION
           ================================================================ 
        */}
        <div className="flex flex-col gap-6 mb-8 md:mb-12">
            
            {/* 1. Dietary Toggles */}
            <div className="flex justify-start">
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-6 border border-green-600/30 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition shadow-sm">
                        <div className="w-3 h-3 border-2 border-green-600 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div></div>
                        Veg
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-6 border border-red-600/30 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition shadow-sm">
                        <div className="w-3 h-3 border-2 border-red-600 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div></div>
                        Non-Veg
                    </button>
                </div>
            </div>

            {/* 2. Category Selector (Full Width at Top) */}
            <div className="w-full">
               {/* NOTE: Ensure your CategorySelector component is styled 
                  to handle horizontal scrolling (overflow-x-auto) 
                  or wrapping (flex-wrap) internally. 
               */}
               <CategorySelector />
            </div>

        </div>


        {/* ================================================================
           COMPONENT: FOOD GRID
           - Updated Grid: 1 col (mobile) -> 2 col (tablet) -> 3 col (md) -> 4 col (lg)
           ================================================================ 
        */}
        <section className="flex-grow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{activeCategory} Menu</h2>
                <span className="text-sm text-slate-500 font-medium">Showing 12 items</span>
            </div>

            {/* Grid updated to lg:grid-cols-4 because sidebar is gone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {
              categoryState == "All Items" ? foodItems.map(foodItem => (
                <MenuFoodItemCard
                  key={foodItem._id.toString()}
                  foodItem={foodItem}
                 
                />)) : (
                foodItemsByCategory[categoryState].length>0 ?
                  foodItemsByCategory[categoryState].map(foodItem => (
                    <MenuFoodItemCard
                      key={foodItem._id.toString()}
                      foodItem={foodItem}
                    />)):<NoFoodMessage variant='menu'/>
                 )
            }       
            </div>
        </section>

      </main>

    </div>
  );
};

export default MenuPage;