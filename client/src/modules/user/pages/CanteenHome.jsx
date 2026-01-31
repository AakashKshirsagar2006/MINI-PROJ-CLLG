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

const CanteenHome = () => {
  const {user} = useContext(AuthContext);
  const { foodItemsByCategory, foodCategories, foodItems } = useFoodItems();
  const { categoryState, setCategoryState } = useContext(FoodCategoryContext);

  if(user){
    if (user.user_type === 'staff') {
    return <Navigate to="/staff" replace />;
  }

 if (user.user_type === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  }
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
        <CategorySelector></CategorySelector>

        {/* --------------------------------------------------
          COMPONENT: FOOD CAROUSEL (Best Sellers)
          -------------------------------------------------- 
        */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Best Sellers 🔥</h2>
            <a href="#" className="text-sm font-bold text-orange-600 hover:underline">View All</a>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
            {
              categoryState == "All Items" ? foodItems.map(foodItem => (
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