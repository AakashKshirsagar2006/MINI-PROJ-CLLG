import { useState} from 'react';
import AuthLeftDesktopVisual from '../components/AuthLeftDesktopVisuals';
import { useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import EmailFormComponent from '../components/ResetPassForms/Email';
import OTPFormComponent from '../components/ResetPassForms/OTP';
import ResetPassFormComponent from '../components/ResetPassForms/ResetPass';
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;


const ResetPasswordPage = () => {

  const [step, setStep] = useState(1);
  
  

  //For Password Reser
  const resetEmail = useRef("");
   const resetPass = useRef("");
   const resetConfirmPass = useRef("");
   const resetCode = useRef("");
   const [activeButton, setActiveButton] = useState(true);
   const [pageErrors, setPageErrors] = useState(null);
  

  const navigate = useNavigate();

  const resetInputFields = (step)=>{
    console.log("Hello inside use navigation");
       if(step===1){ 
        resetEmail.current.value = "";
        setPageErrors(null);
       }
       else if(step===2){
        resetCode.current.value = "";
        setPageErrors(null);
      }
       else if(step===3){
        resetPass.current.value = "";
        resetConfirmPass.current.value = "";
        setPageErrors(null);
       } 
  }


  const onSubmitHandler = async (step)=>{
    
        if(step===1){
          setActiveButton(false);
          const messageBody = {
            email:resetEmail.current.value
          }
          console.log(messageBody.email);
          if(!messageBody.email){
            setActiveButton(true);
             setPageErrors(["Enter email bro"]);
            return;
            }
          
            try{
          const res = await fetch(baseURL+"/auth/reset-password",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageBody),
            credentials:'include'
          });

          if(!res.ok){
            const {errors} = await res.json();
            setPageErrors(errors);
            setActiveButton(true);
            return;
          }
          setActiveButton(true);
          setPageErrors(null);
          setStep(2);
          return;
        }
        catch(err){
          console.log(err);
          setActiveButton(true);
          return setPageErrors(null);
        }
       }
    
    else if(step===2){
      setActiveButton(false);
      const messageBody = {
        resetCode: resetCode.current.value
      }

      if(messageBody.resetCode.length!=6){
        setPageErrors(["Enter a valid otp"])
        setActiveButton(true);
        return;
      }

      try{
          const res = await fetch(baseURL+"/auth/reset-password/reset-code",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageBody),
            credentials:'include'
          });

          if(!res.ok){
            const {errors} = await res.json();
            setPageErrors(errors);
            setActiveButton(true);
            return;
          }
          setActiveButton(true);
          setPageErrors(null);
          setStep(3);
          return;
        }
        catch(err){
          console.log(err);
          setActiveButton(true);
          return setPageErrors(null);
        }
    }

    else if(step===3){
    
      setActiveButton(false);
      const messageBody = {
        newPassword: resetPass.current.value,
        confirmPassword : resetConfirmPass.current.value
      }

       if(messageBody.newPassword != messageBody.confirmPassword){
        setPageErrors(["Confirm password should be same as entered password"]);
        setActiveButton(true);
       }

      try{
          const res = await fetch(baseURL+"/auth/reset-password/update-password",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageBody),
            credentials:'include'
          });

          if(!res.ok){
            const {errors} = await res.json();
            setPageErrors(errors);
            setActiveButton(true);
            return;
          }
          setActiveButton(true);
          setPageErrors(null);
          navigate("/login");
          setStep(1);
          return;
        }
        catch(err){
          console.log(err);
          setActiveButton(true);
          return setPageErrors(null);
        }
    }
  }

  return (
    
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
            <div className="w-8 h-8 bg-orange-500 rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-bold text-lg">C</div>
            <span className="text-xl font-serif font-bold tracking-tighter text-slate-900">Cantina.</span>
        </div> */}


        {/* LoginPa?ge */}
      
        {step===1&&<EmailFormComponent
        emailRef={resetEmail}
        onSubmitHandler={onSubmitHandler}
        buttonActivity={activeButton}
        pageErrors={pageErrors}
        backNavigation={()=>{
          resetInputFields(step);
          navigate('/login');}}
      />}

      {step===2&&<OTPFormComponent
      resetCodeRef={resetCode}
      onSubmitHandler={onSubmitHandler}
      buttonActivity={activeButton}
      pageErrors={pageErrors}
      backNavigation={()=>{
        resetInputFields(step);
        setStep(1);
      }}
      />}


      {step===3&&<ResetPassFormComponent
      passwordRef={resetPass}
      rePasswordRef={resetConfirmPass}
      onSubmitHandler={onSubmitHandler}
      buttonActivity={activeButton}
      pageErrors={pageErrors}
      backNavigation={()=>{
        resetInputFields(step);
        setStep(2);
      }}
      />}

      </div>
    </div>
  );
};

export default ResetPasswordPage;