import { MdOutlineAdminPanelSettings, MdErrorOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { FiUser } from "react-icons/fi";
import { GrUserWorker } from "react-icons/gr";
import AuthPageButton from "./AuthPageButton";
import LoginRoleButton from './LoginRoleButton';

const LoginFormComponent = ({role, setRole, onSubmitHandler, userIdRef, passwordRef, buttonActivity, loginErrors})=>{
  return(
    
        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h1>
                <p className="text-slate-500">Please choose your role to sign in.</p>
            </div>


            {/* ================================================================
               COMPONENT: ROLE SELECTOR
               ================================================================ 
            */}
            <div className="grid grid-cols-3 gap-3">
              
                <LoginRoleButton onClickHandler={()=>{setRole("common")}} role={role} forRole={"common"}>
                  <FiUser className='h-8 w-8' />
                </LoginRoleButton>
                

               
                <LoginRoleButton onClickHandler={()=>{setRole("staff")}} role={role} forRole={"staff"}>
                 <GrUserWorker className='h-8 w-8' />
                </LoginRoleButton>
               

                <LoginRoleButton 
                onClickHandler={()=>{setRole("admin")}} role={role} forRole={"admin"}>
                 <MdOutlineAdminPanelSettings className='h-8 w-8'/>
                </LoginRoleButton>

               
            </div>


             {/* ================================================================
           COMPONENT: ERROR SECTIOn
           ================================================================ 
        */}
        {loginErrors && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <div className="flex flex-col gap-2">
                    {/* Helper to treat string as array so map works for both */}
                    {(Array.isArray(loginErrors) ? loginErrors : [loginErrors]).map((error, index) => (
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
               ================================================================ 
            */}
             <form   
             onSubmit={(e)=>{
                   e.preventDefault();
                   onSubmitHandler()}}
            className="space-y-5"> 
                {/* Dynamic ID Input */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                        {role === 'common' ? 'Email ID' : role === 'staff' ? 'Staff ID' : 'Admin Username'}
                    </label>
                    <input 
                        ref={userIdRef}
                        required
                        type={role === 'common' ? 'email' : 'text'}
                        placeholder={role === 'common' ? 'example@gmail.com' : role === 'staff' ? 'EMP-001' : 'admin_root'}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <Link to="/reset-password" className="text-xs text-orange-600 font-bold hover:underline">Forgot Password?</Link>
                    </div>
                    <input 
                        ref={passwordRef}
                        required
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>
                <AuthPageButton activity={buttonActivity}>Log In as {role === 'common' ? 'Common' : role === 'staff' ? 'Staff' : 'Admin'}</AuthPageButton>

            </form>

            {/* Link to Signup */}
            {role === 'common' && (
                <p className="text-center text-sm text-slate-500">
                    New to campus? 
                    <Link to ="/signup" className="font-bold text-orange-600 hover:text-orange-700 ml-1 transition">Create an account</Link>
                </p>
            )}
            
            {role !== 'common' && (
                <p className="text-center text-xs text-slate-400">
                    Issues logging in? Contact Developers.
                </p>
            )}

        </div>
  )
}

export default LoginFormComponent;