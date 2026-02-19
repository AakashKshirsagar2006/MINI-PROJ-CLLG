import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import HomeLoader from "../components/HomeLoader";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
export const AuthContext = createContext({userState:"", setUserState: ()=>{}});

 

const AuthContextProvider = ({children})=>{
  const [userState, setUserState] = useState(null);
  const [loadingState, setLoadingState] = useState(true);


  const logout = async () => {
    await fetch(baseURL+"/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    setUserState(null);
    navigate("/");
  };
  useEffect( ()=>{
       console.log("Fetching user in use effect");
       fetch(baseURL+"/auth/recognize-me",{
          credentials: "include",
        }).then(res=>{
          if(!res.ok){
          throw new Error("Unauthanticated");
          }
          else
          return res.json();
          }).then(({user})=>{
             setUserState(user);
             setLoadingState(false);
             
          }).catch(err=>{
            console.log(err);
            setUserState(null);
            setLoadingState(false);
          }) 
        
  },[])
  if(loadingState){
    return(
      <HomeLoader/>
    )
  }
  else
  return(
    <AuthContext.Provider value={{userState, setUserState, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContextProvider;