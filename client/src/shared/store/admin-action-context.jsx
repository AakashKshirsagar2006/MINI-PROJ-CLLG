import { createContext, useState } from "react";

// MATCHING YOUR EXISTING HARDCODED URL
const baseURL = import.meta.env.VITE_SERVER_BASE_URL; 

export const AdminActionContext = createContext(null);

const AdminActionContextProvider = ({children}) => {  

  const [adminPageLoadingState, setAdminPageLoadingState] = useState(false);

  /*
  * quickStockActions method
  */
  const quickStockActions = async(itemId, quantity, availability) => {
       setAdminPageLoadingState(true);
       try {
         const res = await fetch(baseURL + "/admin/stock-modification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, availability, quantity }),
          credentials: "include"
        });
      if(!res.ok) throw new Error("Something went wrong");
      setAdminPageLoadingState(false);
       }
       catch(err){
        setAdminPageLoadingState(false);
        console.error(err);
       }    
  }

  const addFoodItems = async (formData) => {
    console.log(formData);
    // Placeholder for future logic
  }

  //  FIX: Added .Provider here
  return (
    <AdminActionContext.Provider value={{ addFoodItems, quickStockActions, adminPageLoadingState }}>
      {children}
    </AdminActionContext.Provider>
  )
}

export default AdminActionContextProvider;