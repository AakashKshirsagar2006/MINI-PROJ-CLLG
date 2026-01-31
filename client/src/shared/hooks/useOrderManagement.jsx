import { useContext } from "react";
import { OrderManagementContext } from "../store/order-management-context";

const useOrderManagement = ()=>{
  const ctx = useContext(OrderManagementContext);
  if(!ctx) throw new Error("useOrderManagement must be used inside the OrderManagementContext");
  return ctx;
}

export default useOrderManagement;