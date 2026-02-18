import { useContext } from "react";
import { AdminActionContext } from "../store/admin-action-context";

const useAdminAction = () => {
  const ctx = useContext(AdminActionContext);
  if(!ctx) throw new Error("useAdminAction must be used within AdminActionContextProvider");
  return ctx;
}

export default useAdminAction;