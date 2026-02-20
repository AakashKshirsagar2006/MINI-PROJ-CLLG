const HomePageHero = ()=>{
  //https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop
  return(
     <section className="relative mt-2 md:mt-10 rounded-[2.5rem] overflow-hidden h-60 md:h-125 flex items-end p-8 md:p-16 group shadow-xl shadow-slate-200">
  <img 
    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
    alt="Hero Food"
  />
  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
  
  <div className="relative z-10 text-white max-w-xl">
    <span className="inline-block py-1.5 px-4 border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-6 bg-white/10">
      Skip the row
    </span>
    <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
      Taste the <br/> <span className="italic font-light text-orange-400">extraordinary.</span>
    </h1>
  </div>
</section>
  )
}

export default HomePageHero;