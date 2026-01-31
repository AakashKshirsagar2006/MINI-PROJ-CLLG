const AuthLeftDesktopVisual = ()=>{
  return(

    <>
      <div className="hidden md:flex w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="sideBanner.avif" 
          alt="Coffee Shop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-orange-500 rounded-tr-xl rounded-bl-xl flex items-center justify-center font-bold text-lg">C</div>
            <span className="text-xl font-serif font-bold tracking-tighter">Cantina.</span>
          </div>
          
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-serif font-bold mb-4">Efficient management, <br/>happy tummies.</h2>
            <p className="text-slate-300">Whether you are a student grabbing a bite or a staff member managing orders, we've got you covered.</p>
          </div>
        </div>
      </div>

</>
  )
}

export default AuthLeftDesktopVisual;