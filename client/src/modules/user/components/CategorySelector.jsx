import { useContext } from "react";
import { FoodCategoryContext } from "../../../shared/store/category-context-store";
import { useFoodItems } from "../../../shared/hooks/useFoodItems";

const CategorySelector = ()=>{
  const {foodCategories} = useFoodItems();
  const {categoryState, setCategoryState} = useContext(FoodCategoryContext);
  return(
    <>
    
        {/* --------------------------------------------------
          COMPONENT: CATEGORY PILLS
          - Horizontal scrolling container (overflow-x-auto)
          -------------------------------------------------- 
        */}
        
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Categories</h2>
              <p className="text-slate-500 text-sm mt-1">Explore our diverse menu</p>
            </div>
          </div>
          
          {/* Scrollable Container */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          
            {foodCategories.map((cat) => (
              <button
              onClick={()=>setCategoryState(cat)}
              key={cat} className={`flex-shrink-0 px-6 py-3 ${categoryState==cat?"bg-slate-900 text-white":"bg-white text-slate-600"} border border-slate-200 rounded-full text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition whitespace-nowrap`}>
                {cat}
              </button>
            ))}
          </div>
        </section>
    </>
  )
}

export default CategorySelector;