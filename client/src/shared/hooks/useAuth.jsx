import { useContext } from "react"
import { AuthContext } from "../store/auth-context"

 const useAuth = ()=>{
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("useAuth must be used inside the AuthContext");
  return ctx;
}

export default useAuth;
