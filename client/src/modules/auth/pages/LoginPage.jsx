import { useState } from 'react';
import { AuthContext } from '../../../shared/store/auth-context';
import AuthLeftDesktopVisual from '../components/AuthLeftDesktopVisuals';
import LoginFormComponent from '../components/LoginFormComponent';
import { useRef } from 'react';
import { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import PlainMessage from '../../../shared/components/PlainMessage';
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;



const LoginPage = () => {

  
  
  // State to handle the selected role
  const [role, setRole] = useState('common');
  
  // For UserLogin
  const userId = useRef("");
  const password = useRef("");
  const [activeLoginButton, setActiveLoginButton] = useState(true);
  const [loginErrors, setLoginErrors] = useState(null);
  const {userState, setUserState} = useContext(AuthContext)


  const navigate = useNavigate();

  const resetInputFields = ()=>{
    userId.current.value = "";
    password.current.value = "";
  }

  const onSubmitHandler = async ()=>{
    console.log("Inside on submit handeler")
        try{
          setActiveLoginButton(false);
         
          if(!userId&&password){
            setActiveLoginButton(true);
            setLoginErrors(["Email and password both are required"]);
            setActiveLoginButton(true);
            return;
          }

          const messageBody = {
              userType:role,
              userID:userId.current.value,
              password:password.current.value
            }

            console.log(messageBody);

          const res = await fetch(baseURL+"/auth/login",{
            method:"POST",
            credentials:"include",
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify(messageBody)
          });

          if(!res.ok){
            const {errors}= await res.json();
            setLoginErrors(errors);
            setActiveLoginButton(true);
            return;
          }

          const {user} = await res.json();
          console.log(user);
          setUserState(user);
           resetInputFields();
          setLoginErrors(null)
          setActiveLoginButton(true); 
           
          //Will this navigation approach will work i dont know
          if(user.user_type=='staff') navigate('/staff/');
          else if(user.user_type==='admin') navigate('/admin/');
          else navigate("/");
        }
        catch(err){
         console.log(err);
        }
        finally{setActiveLoginButton(true)}

       }
   

  return (
    <>
    {!!(userState)?<PlainMessage head={"Already Logged In !"} linkTo="Home" link="/">You are already Logged In. Logout for new Login</PlainMessage>:
    <div className="min-h-screen flex bg-white font-sans text-slate-800">

      {/* ================================================================
        COMPONENT: LEFT SIDE - VISUALS (Desktop Only)
        ================================================================ 
      */}
      <AuthLeftDesktopVisual></AuthLeftDesktopVisual>


      {/* ================================================================
        COMPONENT: RIGHT SIDE - LOGIN FORM
        ================================================================ 
      */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative"> 
        {/* Mobile Logo */}
        {/* <div className="absolute top-6 left-6 flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-bold text-lg">HP</div>
            <span className="text-xl font-serif font-bold tracking-tighter text-slate-900">Hungry Pirates</span>
        </div> */}


        {/* LoginPage */}
       <LoginFormComponent 
        loginErrors={loginErrors}
        onSubmitHandler={onSubmitHandler}
        userIdRef={userId}
        passwordRef={password}
        role={role} 
        setRole={setRole}
        buttonActivity={activeLoginButton}
        />
       
      </div>
    </div>
      }
      </>
  );
}

export default LoginPage;