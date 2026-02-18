import FilterAndSearchStock from "../components/FilterAndSearchStock"
import { useFoodItems } from "../../../shared/hooks/useFoodItems";
import { useReducer, useState ,useRef, useEffect} from "react";
import AdminFoodStockCard from "../components/AdminFoodStockCard";
import fuzzySearch from "../../../shared/utilities/string-matching-algorithm";


const AdminStockActions = ()=>{
const staticFilters = ["NONE","BY NAME","BY ID"];
const {foodItems, foodItemsByCategory, foodCategories, dynamicSearchFilteration} = useFoodItems();
const [dynamicSearchFilterState, setDynamicSearchFilterState] = useState("");
const [staticSearchFilter, setStaticSearchFilter] = useState("NONE");
const [categoryState, setCategoryState] = useState("All Items");
const dynamicFilterRef = useRef("");


const handleEnter = async(e)=>{
  if(e.key==="Enter"){
    console.log(dynamicFilterRef.current.value);
   setDynamicSearchFilterState(dynamicFilterRef.current.value);
  }
}

const resetFilteration = ()=>{
   dynamicFilterRef.current.value="";
   setDynamicSearchFilterState("");
   //setStaticSearchFilter("NONE");
}

useEffect(()=>{
  if(staticSearchFilter=="NONE"){
    resetFilteration();
  }
  else{
    setDynamicSearchFilterState(dynamicFilterRef.current.value);
  }
},[staticSearchFilter,categoryState]);


  

  return(
    <>
       <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">

      <main className="max-w-8xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <FilterAndSearchStock
      resetFilteration={resetFilteration}
      staticFilters={staticFilters}
      staticSearchFilter={staticSearchFilter}
      setStaticSearchFilter={setStaticSearchFilter}
      handleEnter = {handleEnter}
      categoryState={categoryState}
      setCategoryState={setCategoryState}
      dynamicFilterRef={dynamicFilterRef}
      />

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            categoryState === "All Items"?
           dynamicSearchFilteration(foodItems,staticSearchFilter,dynamicSearchFilterState).map((foodItem)=>{
               console.log(foodItem.img);
               return <AdminFoodStockCard key={foodItem._id.toString()} foodItem={foodItem}/>
            })
            :
            (dynamicSearchFilteration(foodItemsByCategory[categoryState],staticSearchFilter,dynamicSearchFilterState) || []).map((foodItem)=>{
              console.log(foodItem.img);
               return <AdminFoodStockCard key={foodItem._id.toString()} foodItem={foodItem}/>
            })
           }
        </div>
      </main>
      </div>
    </>
  )
}

export default AdminStockActions;