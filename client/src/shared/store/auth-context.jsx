import { useEffect, useContext, useState, createContext, useMemo } from "react";
import { useLocation, useNavigate, Outlet, Navigate } from "react-router-dom";
import HomeLoader from "../components/HomeLoader";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

export const AuthContext = createContext({
  userState: null,
  loadingState: true, 
  setUserState: () => {},
  logout: () => {}
});

const AuthContextProvider = ({ children }) => {
  const [userState, setUserState] = useState(null);
  const [loadingState, setLoadingState] = useState(true);
  
  const navigate = useNavigate(); 
  const location = useLocation();

  const logout = async () => {
    try {
      const res = await fetch(baseURL + "/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        setUserState(null);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(baseURL + "/auth/recognize-me", {
          credentials: "include",
        });
        //console.log("Inside the fetching user and doing shit thing\n");
        if (!res.ok) throw new Error("Unauthenticated");
        
        const { user } = await res.json();
        setUserState(user);
        console.log("Location Pathname =", location.pathname);
        if (location.pathname === '/login' || location.pathname === '/'||location.pathname==='') {
          if(user.user_type === 'staff') navigate('/staff/', { replace: true });
          else if(user.user_type === 'admin') navigate('/admin/', { replace: true });
          else if (location.pathname === '/login') navigate("/", { replace: true }); 
        }
      } catch (err) {
        console.log("Needs re-login");
        setUserState(null);
      } finally {
        setLoadingState(false);
      }
    };

    fetchUser();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders in consumer components
  const contextValue = useMemo(() => ({
    userState,
    loadingState,
    setUserState,
    logout
  }), [userState, loadingState]);

  // Block the entire app from rendering until the initial auth check is done
  if (loadingState) {
    return <HomeLoader />;
  } 

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userState } = useContext(AuthContext);
  const location = useLocation();

  const isGuestAllowed = allowedRoles?.includes(null);

  if (!userState && !isGuestAllowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userState && allowedRoles && !allowedRoles.includes(userState.user_type)) {
    // Route them to their respective homebase if they try to access an unauthorized area
    const fallbackRoute = userState.user_type === 'admin' ? '/admin/' : userState.user_type === 'staff' ? '/staff/' : '/';
    return <Navigate to={fallbackRoute} replace />;
  }

  return children ? children : <Outlet/>;
};

export default AuthContextProvider;