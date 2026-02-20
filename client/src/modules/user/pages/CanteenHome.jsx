import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import CategorySelector from '../components/CategorySelector';
import { FoodItemsContext } from '../../../shared/store/food-item-context-store';
import { FoodCategoryContext } from '../../../shared/store/category-context-store';
import { useCart } from '../../../shared/store/cart-context';
import HomePageHero from '../components/HomePageHero';
import { useFoodItems } from '../../../shared/hooks/useFoodItems';
import NoFoodMessage from '../components/NoFoodMessage';
import { AuthContext } from '../../../shared/store/auth-context';
import Footer from '../components/Footer';

const CanteenHome = () => {
  const { userState: user } = useContext(AuthContext);
  const { foodItemsByCategory, foodCategories, foodItems, bestSellers, todaysSpecial } = useFoodItems();
  console.log(todaysSpecial);
  const { categoryState, setCategoryState } = useContext(FoodCategoryContext);


  return (
    // MAIN WRAPPER
    
    <>
      {/* ================================================================
        MAIN CONTENT AREA
        ================================================================ 
      */}
      <main className="max-w-8xl mx-auto px-4 md:px-6 py-10 space-y-12 pb-12">

        {/* --------------------------------------------------
          COMPONENT: HERO SECTION
          -------------------------------------------------- 
        */}
        <HomePageHero />
        

        {/* --------------------------------------------------
          COMPONENT: FOOD CAROUSEL (Best Sellers)
          -------------------------------------------------- 
        */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Todays Special 🔥</h2>
            
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
            {
               (
                todaysSpecial.length>0 ?
                  todaysSpecial.map(foodItem => (
                    <FoodItemCard
                      key={foodItem._id.toString()}
                      foodItem={foodItem}
                    />)):<NoFoodMessage variant="carousel"/>
                 )
            }

          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Best Sellers 🔥</h2>
            
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
            {
              bestSellers.length>0?bestSellers.map(foodItem => (
                <FoodItemCard
                  key={foodItem._id.toString()}
                  foodItem={foodItem}
                 
                />)):(<NoFoodMessage variant="carousel"/>
                 )
            }

          </div>
        </section>

      
      
      <CategorySelector></CategorySelector>
       <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Quick Menue</h2>
            <a href="/menu" className="text-sm font-bold text-orange-600 hover:underline">View All</a>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
            {
              categoryState == "All Items" ? foodItems.slice(0,30).map(foodItem => (
                <FoodItemCard
                  key={foodItem._id.toString()}
                  foodItem={foodItem}
                 
                />)) : (
                foodItemsByCategory[categoryState].length>0 ?
                  foodItemsByCategory[categoryState].map(foodItem => (
                    <FoodItemCard
                      key={foodItem._id.toString()}
                      foodItem={foodItem}
                    />)):<NoFoodMessage variant="carousel"/>
                 )
            }

          </div>
        </section>

      </main>

       
    </>
  );
};

export default CanteenHome;