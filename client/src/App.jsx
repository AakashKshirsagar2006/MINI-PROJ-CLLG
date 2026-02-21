
import { Outlet } from "react-router-dom";
import AuthContextProvider from "./shared/store/auth-context";

const App = () => {
  
  return <>
  <AuthContextProvider>
  <Outlet/>
  </AuthContextProvider>
  </>
};

export default App;
