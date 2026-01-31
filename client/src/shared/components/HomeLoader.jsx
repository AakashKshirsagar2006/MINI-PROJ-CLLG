import React from 'react';

const HomeLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 animate-pulse">

      {/* ================================================================
        SKELETON: HEADER (Desktop)
        ================================================================ 
      */}
      <header className="hidden md:flex justify-between items-center py-5 px-10 border-b border-slate-200 bg-white">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
          <div className="w-24 h-6 bg-slate-200 rounded-md"></div>
        </div>
        {/* Nav Links */}
        <div className="flex gap-8">
          <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        </div>
      </header>


      {/* ================================================================
        SKELETON: MOBILE TOP BAR
        ================================================================ 
      */}
      <div className="md:hidden flex justify-between items-center p-6 bg-slate-50">
        <div>
          <div className="w-12 h-3 bg-slate-200 rounded-md mb-2"></div>
          <div className="w-32 h-5 bg-slate-200 rounded-md"></div>
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
      </div>


      <main className="max-w-7xl mx-auto px-4 md:px-10 space-y-12 pb-12">

        {/* ================================================================
          SKELETON: HERO SECTION
          ================================================================ 
        */}
        <section className="mt-2 md:mt-10">
           <div className="w-full h-[450px] md:h-[500px] bg-slate-200 rounded-[2.5rem]"></div>
        </section>


        {/* ================================================================
          SKELETON: CATEGORY PILLS
          ================================================================ 
        */}
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
             <div className="space-y-2">
                <div className="w-32 h-6 bg-slate-200 rounded-md"></div>
                <div className="w-48 h-4 bg-slate-200 rounded-md"></div>
             </div>
          </div>
          
          <div className="flex gap-3 overflow-hidden">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="shrink-0 w-24 h-10 bg-slate-200 rounded-full"></div>
             ))}
          </div>
        </section>


        {/* ================================================================
          SKELETON: CAROUSEL (Best Sellers)
          ================================================================ 
        */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="w-40 h-8 bg-slate-200 rounded-md"></div>
            <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
          </div>

          <div className="flex gap-6 overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
             {[1, 2, 3].map((i) => (
                <div key={i} className="shrink-0 w-[280px] md:w-[320px] bg-white p-4 rounded-[2rem] border border-slate-100">
                   {/* Image Area */}
                   <div className="h-48 bg-slate-200 rounded-[1.5rem] mb-4"></div>
                   {/* Text Lines */}
                   <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-2"></div>
                   <div className="h-4 w-1/2 bg-slate-200 rounded-md mb-4"></div>
                   {/* Price & Button */}
                   <div className="flex justify-between items-center">
                      <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
                      <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                   </div>
                </div>
             ))}
          </div>
        </section>


        {/* ================================================================
          SKELETON: FOOD GRID (Recommended)
          ================================================================ 
        */}
        <section>
           <div className="w-48 h-8 bg-slate-200 rounded-md mb-6 mx-2"></div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="flex gap-4 bg-white p-3 rounded-[2rem] border border-transparent">
                    <div className="w-32 h-32 shrink-0 bg-slate-200 rounded-[1.5rem]"></div>
                    <div className="flex flex-col justify-center flex-grow pr-2 space-y-3">
                       <div className="h-5 w-full bg-slate-200 rounded-md"></div>
                       <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                       <div className="flex justify-between items-center mt-2">
                          <div className="h-5 w-12 bg-slate-200 rounded-md"></div>
                          <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

      </main>


      {/* ================================================================
        SKELETON: MOBILE BOTTOM NAV
        ================================================================ 
      */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden">
         <div className="h-20 bg-slate-200 rounded-2xl w-full"></div>
      </div>

    </div>
  );
};

export default HomeLoader;