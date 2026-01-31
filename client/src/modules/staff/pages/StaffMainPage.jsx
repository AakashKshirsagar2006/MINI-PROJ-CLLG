import { useState } from "react";
import HeaderAndNav from "../components/HeaderAndNav";
import StaffDashBoardPage from "../components/StaffDashBoardPage";
const StaffMainPage = ()=>{
  const [currentOrdersState, setCurrentOrdersState] = useState("PENDING");
  return(
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28 md:pb-12">
        <HeaderAndNav
         currentOrdersState={currentOrdersState} 
         setCurrentOrdersState={setCurrentOrdersState}/>
        <StaffDashBoardPage orderState={currentOrdersState}/>
       </div>
  )
}

export default StaffMainPage;