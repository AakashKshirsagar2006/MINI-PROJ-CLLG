import { MdOutlineAdminPanelSettings, MdErrorOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import AuthPageButton from "./AuthPageButton";
import AuthPageInputField from "./AuthPageInputField";
import { useNavigate } from "react-router-dom";

const PasswordResetFormComponent = ({onSubmitHandler, emailRef ,passwordRef, rePasswordRef,resetOtpRef, buttonActivity, processErrors, setCurrentPageState})=>{
    const navigate = useNavigate();
  return(
    
        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">Reset your Password</h1>
            </div>


            

             {/* ================================================================
           COMPONENT: ERROR SECTION
           - Placed between Role Selector and Form
           - Handles both String (single error) and Array (multiple errors)
           ================================================================ 
        */}
        {processErrors && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <div className="flex flex-col gap-2">
                    {/* Helper to treat string as array so map works for both */}
                    {(Array.isArray(processErrors) ? processErrors : [processErrors]).map((error, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <MdErrorOutline className='h-5 w-5 shrink-0 mt-0.5'/>
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

            {/* ================================================================
               COMPONENT: FORM INPUTS
               - Labels change dynamically based on state
               ================================================================ 
            */}
             <form   
             onSubmit={(e)=>{
                   e.preventDefault();
                   onSubmitHandler("resetPassword")}}
            className="space-y-5"> 
                {/* Dynamic ID Input */}
                <AuthPageInputField
                ref = {emailRef}
                type="email"
                disabled={false}
                placeholder="example@gmail.com"
                >Gmail ID</AuthPageInputField>

                <AuthPageInputField
                ref = {resetOtpRef}
                type="text"
                disabled={false}
                isVisible={true}
                placeholder="123456"
                >Enter OTP sent to your email</AuthPageInputField>
                
                
                <AuthPageInputField
                ref = {passwordRef}
                type="password"
                disabled={false}
                placeholder="••••••••"
                >Enter your new password</AuthPageInputField>

                <AuthPageInputField
                ref = {rePasswordRef}
                type="password"
                disabled={false}
                isVisible={false}
                placeholder="••••••••"
                >Confirm your new Password</AuthPageInputField>

                
               
                <div>
                <AuthPageButton activity={buttonActivity}>Proceed</AuthPageButton>
                </div>
                <div>
                <AuthPageButton 
                activity={buttonActivity} 
                direction="left" 
                type="button"
                onClick={()=>{
                        //e.preventDefault();
                        navigate("/login");
                    }}
                >Back to Login</AuthPageButton>
                </div>

            </form>

            
        </div>
  )
}

export default PasswordResetFormComponent;