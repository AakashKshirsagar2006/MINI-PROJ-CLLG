

const OpenionPopup = ({ isOpen, handleOnClosePopup, head, body, setOpenion}) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center opacity-100 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {head}
          </h3>
          <button onClick={()=>{
                setOpenion("abort");
                handleOnClosePopup();
              }} className="text-gray-300 hover:text-white text-xl font-bold">
            &times;
          </button>
        </div>
        
        <div className="p-6">
          {body}

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={()=>{
                setOpenion("abort");
                handleOnClosePopup();
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
            onClick={()=>{
              setOpenion("proceed");
              handleOnClosePopup();
            }}
              type="button"
              className="px-4 py-2 text-sm font-semibold text-slate-900 bg-green-500 hover:bg-green-600 rounded-md transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenionPopup;