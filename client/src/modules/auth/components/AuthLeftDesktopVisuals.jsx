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
    
          {/* -------------------
                 Brand Logo 
          ---------------------*/}
          <div className="flex items-center gap-3">
          {/* Circular Image Section */}
          <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm p-1.5">
            <img
              src="/fcritlogo.png"
              alt="FCRIT Logo"
              className="w-50px h-50px object-cover"
            />
          </div>

          {/* Brand Text */}
          <span className="text-xl font-serif font-bold tracking-tighter text-white">
            FCRIT Canteen
          </span>
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