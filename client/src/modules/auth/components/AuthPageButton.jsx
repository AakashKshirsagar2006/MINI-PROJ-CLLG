import { HiArrowRight } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";

const AuthPageButton = ({
  children,
  activity,
  direction = "right",
  buttonType = "submit",
  onClick = () => {}
}) => {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={!activity}
      className={`w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg
        shadow-xl shadow-slate-900/20 transition duration-300 transform
        flex justify-center items-center gap-2
        ${!activity
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-orange-500 hover:shadow-orange-500/30 active:scale-95"
        }`}
    >
      {direction === "right" ? (
        <>
          {children}
          <HiArrowRight className="h-5 w-5" />
        </>
      ) : (
        <>
          <HiArrowLeft className="h-5 w-5" />
          {children}
        </>
      )}
    </button>
  );
};

export default AuthPageButton;