import React from 'react';
import { useRef, useState } from 'react';
import { MdErrorOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import AuthPageButton from '../components/AuthPageButton';
import AuthLeftDesktopVisual from '../components/AuthLeftDesktopVisuals';
import { useContext } from 'react';
import { AuthContext } from '../../../shared/store/auth-context';
import PlainMessage from '../../../shared/components/PlainMessage';
const baeURL = import.meta.env.VITE_SERVER_BASE_URL;
const SignupPage = () => {

  const navigate = useNavigate();
  const {userState, setUserState} = useContext(AuthContext);
  const [signupErrors, setSignupErrors] = useState([]);
  const [otpState, setOtpState] = useState(false);

  //Button states
  const [activeSignupButton, setActiveSignupButton] = useState(true);
  const [activeProceedButton, setActiveProceedButton] = useState(true);

  useEffect(() => {
  if (signupErrors.length) setSignupErrors([]);
}, [otpState]);


  const user_name = useRef("");
  const email = useRef("");
  const password = useRef("");
  const confirm_password = useRef("");
  const otp = useRef("");

  const resetInputFields = () => {
    user_name.current.value = "";
    email.current.value = "";
    password.current.value = "";
    confirm_password.current.value = "";
    otp.current.value = ""
  }

  useEffect(() => {
  if (otpState) otp.current?.focus();
}, [otpState]);


  const handleSignup = async (e) => {
    if (!activeSignupButton) return;
    setActiveSignupButton(false);
    e.preventDefault();
    setSignupErrors([]);
    const user_data = {
      user_type: 'common',
      name: user_name.current.value,
      email: email.current.value,
      password: password.current.value,
      confirm_password: confirm_password.current.value
    }


    try {
      const res = await fetch(baeURL+"/auth/signup",
        {
          method: "POST",              // GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user_data),
          credentials: 'include'
        })

      if (!res.ok) {
        const { errors } = await res.json();
        setSignupErrors(errors)
      }
      else {
        setOtpState(true);
      }
    }
    catch (err) {
      console.log(err);
      setSignupErrors([])
    }
    finally {
      setActiveSignupButton(true);
    }
  }




  const handleOTP = async (e) => {
    if (!activeProceedButton) return;
    if (!otp.current.value.trim()) {
  setSignupErrors(["Please enter the OTP"]);
  setActiveProceedButton(true);
  return;
}

    setActiveProceedButton(false);
    e.preventDefault();
    const data = { otp: otp.current.value }
    try {
      const res = await fetch(baeURL+"/auth/signup/validate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })
      if (!res.ok) {
        const { errors } = await res.json()
        setSignupErrors(errors);
        
      }
      else {
        const serverRes = await res.json();
        console.log(serverRes);
        resetInputFields();
        alert("Signup Successful");
        navigate("/login")
        setOtpState(false);
      }
    }
    catch (err) {
      console.log(err);
      setSignupErrors([]);
      setOtpState(false);
    }
    finally {
      setActiveProceedButton(true);
    }

  }

  return (
    <>
    {userState?<PlainMessage head={"Already Logged In !"} linkTo='Home' link='/'>The user is already logged in.Logout for new signup</PlainMessage>:
    <div className="min-h-screen flex bg-white font-sans text-slate-800">

      {/* ================================================================
        COMPONENT: LEFT SIDE - VISUALS (Desktop Only)
        - Hidden on mobile (hidden md:flex)
        - Displays a high-quality food image with branding
        ================================================================ 
      */}
      <AuthLeftDesktopVisual></AuthLeftDesktopVisual>


      {/* ================================================================
        COMPONENT: RIGHT SIDE - SIGN UP FORM
        ================================================================ 
      */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">

        {/* Mobile Logo (Visible only on small screens) */}
        {/* <div className="absolute top-6 left-6 flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-orange-500 rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className="text-xl font-serif font-bold tracking-tighter text-slate-900">Cantina.</span>
        </div> */}

        <div className="w-full max-w-md space-y-8">

          {/* Header Text */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join the campus food revolution. Skip the line.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-400">Sign up with email</span></div>
          </div>



          {/* ================================================================
               COMPONENT: ERROR SECTION
              
               ================================================================ 
            */}
          {signupErrors.length > 0 && (
            <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <div className="flex flex-col gap-2">
                {signupErrors.map((error, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {/* shrink-0 ensures the icon doesn't get squashed if text is long */}
                    <MdErrorOutline className='h-5 w-5 shrink-0 mt-0.5' />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ================================================================
               COMPONENT: SIGNUP FORM AND OTP FORM WITH CONDITIONAL RENDERINF
               ================================================================ 
            */}

          <form onSubmit={handleOTP} className={`space-y-5 ${otpState ? "block" : "hidden"}`} >
            <div
              className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Enter OTP</label>
              <input
                ref={otp}
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]*"
                placeholder="123456"

                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>


            {/* Submit Button */}
            <AuthPageButton activity={activeProceedButton}>Proceed</AuthPageButton>

          </form>

          <form onSubmit={handleSignup} className={`space-y-5 ${!otpState ? "block" : "hidden"}`}>
            {/* Name Input */}
            <div
              className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                ref={user_name}
                type="text"
                placeholder="e.g. Aditi Gupta"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            {/* Email Input */}
            <div

              className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email ID</label>
              <input
                ref={email}
                type="email"
                placeholder="aditi.g@college.edu"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                ref={password}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
              <p className="text-xs text-slate-400 text-right">Must be at least 8 characters</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                ref={confirm_password}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
              <p className="text-xs text-slate-400 text-right">Must be same as password</p>
            </div>

            {/* Submit Button */}
            <AuthPageButton activity={activeSignupButton}>Create Account</AuthPageButton>
            
          </form>

          {/* Footer / Login Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 ml-1 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
}
    </>
  );
};

export default SignupPage;