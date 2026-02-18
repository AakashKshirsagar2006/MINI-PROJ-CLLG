import { useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { useFoodItems } from "../../../shared/hooks/useFoodItems";

const FilterAndSearchStock = ({staticFilters,staticSearchFilter, setStaticSearchFilter,dynamicFilterRef,categoryState, setCategoryState, handleEnter}) => {
  const {foodCategories} = useFoodItems();

  return(
    <>
      <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center bg-white p-4 md:p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full">
        {/* Search filter */}
        <div className="order-2 md:order-1 w-full md:w-auto">
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full w-full">
                  <IoSearch className="text-slate-400"/>
                  <input
                  ref={dynamicFilterRef}
                  onKeyDown={(e)=>{ handleEnter(e); }}
                  type="text" placeholder="Search..." className="bg-transparent text-sm focus:outline-none w-full md:w-48" />
               </div>
          </div>
        </div>

        <div className="order-1 md:order-2 flex flex-wrap gap-1">
            {staticFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {setStaticSearchFilter(filter)}}
                className={`
                  flex-1 sm:flex-none 
                  px-3 sm:px-6 py-2 
                  rounded-xl 
                  text-[10px] sm:text-xs font-bold tracking-wider transition-all duration-200
                  whitespace-nowrap
                  ${
                    staticSearchFilter === filter
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Categories</h2>
              <p className="text-slate-500 text-sm mt-1">Filter By Category</p>
            </div>
          </div>
          
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
  );
}

export default FilterAndSearchStock;