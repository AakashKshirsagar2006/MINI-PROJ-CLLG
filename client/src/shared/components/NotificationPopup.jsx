import { createPortal } from "react-dom";
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

const NotificationPopup = ({ show, message, type }) => {
  if (!show) return null;

  const isSuccess = type === "success";
  
  return createPortal(
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${
      isSuccess ? "bg-slate-900 text-white" : "bg-red-500 text-white"
    }`}>
      {isSuccess ? <IoCheckmarkCircle className="text-2xl text-green-400" /> : <IoAlertCircle className="text-2xl text-white" />}
      <div>
        <h4 className="font-bold text-sm">{isSuccess ? "Success" : "Error"}</h4>
        <p className="text-xs opacity-90 font-medium">{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default NotificationPopup;