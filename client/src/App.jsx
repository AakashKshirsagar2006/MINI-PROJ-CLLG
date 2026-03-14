
import { Outlet } from "react-router-dom";
import AuthContextProvider from "./shared/store/auth-context";
import { Toaster } from "react-hot-toast";

const App = () => {
  
  return <>
  <AuthContextProvider>
  <Toaster position="top-center" reverseOrder={false} />
  <Outlet/>
  </AuthContextProvider>
  </>
};

export default App;
