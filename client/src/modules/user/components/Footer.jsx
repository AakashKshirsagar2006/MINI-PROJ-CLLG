const Footer = ()=>{
  return(
    <>
    {/* ================================================================
        COMPONENT: FOOTER
        - Dark background, clearly separated links
        ================================================================ 
      */}
      <footer className="bg-slate-900 text-slate-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Footer Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif font-bold text-white mb-4">FCRIT Canteen</h2>
            <p className="text-sm leading-relaxed mb-6">
              Serving the freshest meals to students with love and premium ingredients.
            </p>
            <div className="flex gap-4">
               {/* Social Icons placeholders */}
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition cursor-pointer">fb</div>
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition cursor-pointer">tw</div>
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition cursor-pointer">in</div>
            </div>
          </div>

          {/* Footer Links Column */}
          {/* <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Order Help</a></li>
              <li><a href="#" className="hover:text-white transition">Wallet FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Standards</a></li>
            </ul>
          </div> */}

           {/* Footer Links Column */}
           <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/staff" className="hover:text-white transition">Visit staff Page</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Footer Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <div className="flex bg-slate-800 rounded-xl p-1">
              <input type="email" placeholder="Your email" className="bg-transparent px-3 text-sm w-full focus:outline-none text-white" />
              <button className="bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 pt-8 border-t border-slate-800 text-xs text-center md:text-left">
          &copy; 2024 College Canteen Project. All rights reserved.
        </div>
      </footer>
    </>
  )
}

export default Footer;