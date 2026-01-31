import { Link } from 'react-router-dom'; 
const PlainMessageAdminStaff = ({children, head, onclickFunc, buttonText}) => {
  return (    
    
    <section className="w-full flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="mb-8 max-w-md">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
            {head}
        </h2>
        <p className="text-slate-500">
            {children}
        </p>
      </div>
      <button
        onClick={onclickFunc}
        className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
      >
        {buttonText}
      </button>

    </section>
  );
}

export default PlainMessageAdminStaff;