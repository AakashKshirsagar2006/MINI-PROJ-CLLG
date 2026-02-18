import { 
  IoGridOutline, 
  IoFastFoodOutline, 
  IoPeopleOutline, 
  IoTimeOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
} from "react-icons/io5";

const NavItem = ({ id, icon, label, setActiveView, setIsSidebarOpen, activeView}) => (
    <button 
      onClick={() => { setActiveView(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 border-r-4
      ${activeView === id 
        ? 'bg-orange-50 text-orange-600 border-orange-500' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 border-transparent'}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
);

const SideBarNav = ({toggleSidebar, isSidebarOpen, setActiveView, setIsSidebarOpen, activeView}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={toggleSidebar}></div>
      )}
    
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-8 flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-serif font-bold text-xl">C</div>
           <span className="font-serif font-bold text-2xl text-slate-900">Cantina.</span>
        </div>
    
        {/* Navigation */}
        <nav className="flex-1 space-y-2 mt-4">
           <NavItem id="dashboard" icon={<IoGridOutline />} label="Overview"
           setActiveView={setActiveView}
           setIsSidebarOpen={setIsSidebarOpen}
           activeView= {activeView} />
           
           <NavItem id="menu" icon={<IoFastFoodOutline />} label="Menu Items" setActiveView={setActiveView}
           setIsSidebarOpen={setIsSidebarOpen} 
           activeView= {activeView}/>
           
           <NavItem id="staff" icon={<IoPeopleOutline />} label="Staff Team" setActiveView={setActiveView}
           setIsSidebarOpen={setIsSidebarOpen} 
           activeView= {activeView}/>
           
           <NavItem id="history" icon={<IoTimeOutline />} label="Order History" setActiveView={setActiveView}
           setIsSidebarOpen={setIsSidebarOpen} 
           activeView= {activeView}/>
        </nav>
    
        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-100">
           <button className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition text-sm font-bold mb-4">
              <IoSettingsOutline className="text-xl" /> Settings
           </button>
           <button className="flex items-center gap-3 text-red-400 hover:text-red-600 transition text-sm font-bold">
              <IoLogOutOutline className="text-xl" /> Log Out
           </button>
        </div>
      </aside>
    </>
  )
}

export default SideBarNav;