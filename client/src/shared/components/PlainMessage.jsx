import { Link } from 'react-router-dom'; // or use 'a' tag if not using React Router

const PlainMessage = ({children, head,linkTo="Home", link="/"}) => {
  return (    

<section className="w-full flex flex-col items-center justify-center text-center py-20 px-4">
    
    {/* Text Section */}
    <div className="mb-8 max-w-md">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
            {head}
        </h2>
        <p className="text-slate-500">
            {children}
        </p>
    </div>

    {/* Login Button */}
    <Link 
        to={link}
        className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
    >
        {linkTo}
    </Link>

</section>
  );
}

export default PlainMessage;