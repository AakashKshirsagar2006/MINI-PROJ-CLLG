import React, { useState, useRef, useEffect, useMemo } from 'react';
import MenuFoodItemCard from '../components/MenuFoodItemCard';
import CategorySelector from '../components/CategorySelector';
import { FoodItemsContext } from '../../../shared/store/food-item-context-store';
import { useContext } from 'react';
import { FoodCategoryContext } from '../../../shared/store/category-context-store';
import { useCart } from '../../../shared/store/cart-context';
import { useFoodItems } from '../../../shared/hooks/useFoodItems';
import NoFoodMessage from '../components/NoFoodMessage';
import FilterAndSearchStock from '../../admin/components/FilterAndSearchStock';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';

const MenuPage = () => {
  // Mock state for category selection

  const { items, loading, addToCart } = useCart();
  const itemsInCart = items ? Object.keys(items) : [];
  //const [activeCategory, setActiveCategory] = useState('All');

  const { foodItemsByCategory, foodCategories, foodItems, dynamicSearchFilteration} = useFoodItems();

  const [menuPageFoodItemsState, setMenuPageFoodItemsState] = useState(foodItems);

  
  
  
  const { categoryState } = useContext(FoodCategoryContext);
  // const staticFilters = ["NONE", "BY NAME"];
  // const [staticSearchFilter, setStaticSearchFilter] = useState("NONE");
  const dynamicFilterRef = useRef("");
  const [searchTerm, setSearchTerm] = useState("");

  const foodItemsOnMenu = useMemo(() => {
    let baseItems = [];
    if (categoryState === "All Items" || !categoryState) {
      baseItems = foodItems || [];
    } else {
      baseItems = foodItemsByCategory[categoryState] || [];
    }

    if (searchTerm.length >= 3) {
      return dynamicSearchFilteration(baseItems, "BY NAME", searchTerm);
    }

    return baseItems;
  }, [categoryState, searchTerm, foodItems, foodItemsByCategory, dynamicSearchFilteration]);

  

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      if(dynamicFilterRef.current.value.length<3) return;
      setSearchTerm(dynamicFilterRef.current.value);
      window.scrollTo(0, 0);
    }
  }

  const resetFilteration = () => {
    dynamicFilterRef.current.value = "";
    setSearchTerm("");
    //setStaticSearchFilter("NONE");
  }

  const handleReset = ()=>{
    if(searchTerm.length>=3){
      window.scrollTo(0, 0);
    }
    resetFilteration();
  }



  

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">


        {/*======================
          Advanced Search filter 
        ======================*/}
        <div className="sticky top-12 lg:top-26 z-10 flex flex-col md:flex-row gap-4 md:gap-2 items-center bg-white p-4 md:p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full">
          <div className="order-2 md:order-1 w-full md:w-auto">
            <div className="flex items-center gap-2">

              {/* Search Input Container */}
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full w-full">
                <IoSearch className="text-slate-400 shrink-0" />

                <input
                  ref={dynamicFilterRef}
                  onKeyDown={(e) => { handleEnter(e); }}
                  type="text"
                  placeholder="Search..."
                  // Added flex-1 so the input takes up available space, pushing the cross button right
                  className="bg-transparent text-sm focus:outline-none flex-1 md:w-48"
                />

                {/* Cross / Clear Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none shrink-0"
                  aria-label="Clear search"
                >
                  <IoClose size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>
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
            {/* <div className="flex justify-start">
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
            </div> */}

            {/* 2. Category Selector (Full Width at Top) */}
            <div className="w-full">
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
              <h2 className="text-xl md:text-2xl font-bold text-slate-900"> Menu</h2>
              <span className="text-sm text-slate-500 font-medium">Showing 12 items</span>
            </div>

            {/* Grid updated to lg:grid-cols-4 because sidebar is gone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             
              {
                foodItemsOnMenu.length>0?
                foodItemsOnMenu.map(foodItem=>(
                  <MenuFoodItemCard
                    key={foodItem._id.toString()}
                    foodItem={foodItem}
                  />
                )):
                <NoFoodMessage variant='menu'/>
              }
            </div>
          </section>

        </main>

      </div>

    </>
  );
};

export default MenuPage;