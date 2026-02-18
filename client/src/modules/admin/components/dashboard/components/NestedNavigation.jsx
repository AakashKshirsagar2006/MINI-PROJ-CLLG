import { useState } from "react";

const NestedNavigation = ({tabs, setFoodManagementPageState}) => {
  // If tabs array is empty or undefined, provide a default
  const safeTabs = tabs && tabs.length > 0 ? tabs : ["Overview"];
  const [tabState, setTabState] = useState(safeTabs[0]);

  return (
    <div className="flex gap-0.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto overflow-x-auto">
      {safeTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setTabState(tab);
            if(setFoodManagementPageState) setFoodManagementPageState(tab);
          }}
          className={`
            flex-1 sm:flex-none 
            px-3 sm:px-6 py-2 
            rounded-xl 
            text-[10px] sm:text-xs font-bold tracking-wider transition-all duration-200
            whitespace-nowrap
            ${
              tabState === tab
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NestedNavigation;