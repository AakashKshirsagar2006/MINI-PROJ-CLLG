import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useFoodItems } from "../../../../../shared/hooks/useFoodItems"; // We will create this hook next!
import { IoAdd, IoCloudUploadOutline, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import NotificationPopup from "../../../../../shared/components/NotificationPopup";
// SAFETY FIX: Hardcoded URL for stability
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

// --- 1. Reusable Popup Component ---


export const AddNewFoodItem = () => {
  const { foodCategories } = useFoodItems();
  const [imageState, setImageState] = useState(null);
  const fileInputRef = useRef(null);
  
  // Notification State
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const triggerNotification = (msg, type) => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget.form;
    const formData = new FormData(formElement);

    try {
      const response = await fetch(`${baseURL}/admin/add-food-item`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        triggerNotification("Item added successfully!", "success");
        formElement.reset();
        setImageState(null);
      } else {
        console.error("Server Error:", data);
        triggerNotification(data.error || "Failed to add item", "error");
      }
    } catch (error) {
      console.error("Network Error:", error);
      triggerNotification("Network error. Please try again.", "error");
    }
  };

  const labelClass = "text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block";
  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-orange-500 text-sm font-medium outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm sticky top-24">
      <NotificationPopup {...notification} />

      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
        Add Food Item
      </h3>

      <form className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full" onSubmit={handleSubmit}>

        {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
        <div
          onClick={() => fileInputRef.current.click()}
          className={`lg:col-span-2 relative w-full h-48 min-h-75 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${imageState ? 'border-orange-500 bg-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-orange-400'}`}
        >
          {imageState ? (
            <>
              <img src={imageState} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <p className="text-white font-bold text-sm bg-white/20 border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">Change Image</p>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 group-hover:text-orange-500 transition-colors">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 group-hover:shadow-md transition-all border border-slate-100 group-hover:border-orange-100">
                <IoCloudUploadOutline className="text-5xl opacity-80" />
              </div>
              <span className="text-lg font-extrabold block tracking-tight text-slate-700 group-hover:text-orange-600">Click to Upload</span>
              <span className="text-sm font-medium opacity-60 mt-2 block bg-slate-200/50 px-3 py-1 rounded-full group-hover:bg-orange-100/50 transition-colors">PNG, JPG up to 10MB</span>
            </div>
          )}
        </div>

        <input ref={fileInputRef} name="image" type="file" hidden accept="image/*" onChange={handleImageChange} />

        {/* --- RIGHT COLUMN: INPUT FIELDS --- */}
        <div className="lg:col-span-2 flex flex-col gap-5 justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>UID</span>
              <input name="itemUID" type="text" placeholder="Item UID" className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Tag</span>
              <input name="tag" type="text" placeholder="TAG" className={inputClass} />
            </div>
          </div>

          <div>
            <span className={labelClass}>Name</span>
            <input name="name" type="text" placeholder="Item Name" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>Price</span>
              <input name="price" type="number" placeholder="Price" className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Category</span>
              <select name="category" className={`${inputClass} cursor-pointer text-slate-600`}>
                {foodCategories && foodCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>Stock</span>
              <input name="quantity" type="number" placeholder="Default Stock" className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Type</span>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-transparent">
                <label className="flex-1 text-center cursor-pointer">
                  <input type="radio" name=" dietaryType" value="Veg" className="peer hidden" defaultChecked />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-green-600 peer-checked:shadow-sm transition-all">Veg</span>
                </label>
                <label className="flex-1 text-center cursor-pointer">
                  <input type="radio" name="dietaryType" value="Non-Veg" className="peer hidden" />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-red-500 peer-checked:shadow-sm transition-all">Non-Veg</span>
                </label>

                <label className="flex-1 text-center cursor-pointer">
                  <input type="radio" name="dietaryType" value="Egg" className="peer hidden" />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-amber-900 peer-checked:shadow-sm transition-all">EGG</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <span className={labelClass}>Highlights</span>
            <input name="highlights" type="text" placeholder="Highlights (comma separated)" className={inputClass} />
          </div>

          <div className="pt-2 mt-auto">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <IoAdd className="text-xl" /> Add to Menu
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};



export const UpdateFoodItem = ({formState}) => {
  const { foodCategories, foodItems } = useFoodItems();
  const [fieldDisability, setFieldDisabilty] = useState(true);
  const [itemState, setItemState] = useState({  dietaryType: "",  category: "" });
  const [imageState, setImageState] = useState(null);
  const fileInputRef = useRef(null);
  const uidRef = useRef("");



  // Notification State
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const triggerNotification = (msg, type) => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const fi = foodItems.filter(f => f.itemUID === uidRef.current.value);
    if (fi[0]) {
      setItemState(fi[0]);
      setImageState(baseURL+"/uploads/"+fi[0].img);
      setFieldDisabilty(false);
      triggerNotification("Item details loaded", "success");
    } else {
      console.error("Item Not Found\n");
      triggerNotification("Item not found. Please check the UID.", "error");
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget.form;
    const formData = new FormData(formElement);
    const itemId = itemState._id;

    if (!itemId) return;

    try {
      const response = await fetch(`${baseURL}/admin/update-food-item/${itemId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Success:", data);
        triggerNotification("Item updated successfully!", "success");
        
        setItemState({  dietaryType: "", category: "" }); 
        setImageState(null);
        formElement.reset(); 
        setFieldDisabilty(true); 
        
      } else {
        console.error("Server Error:", data);
        triggerNotification(data.error || "Failed to update item", "error");
      }
    } catch (error) {
      console.error("Network Error:", error);
      triggerNotification("Network error occurred.", "error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget.form;
    const itemId = itemState._id?.toString();
    if (!itemId) return;
    try {
      const res = await fetch(baseURL + "/admin/delete-food-item/" + itemId, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      triggerNotification("Item deleted successfully", "success");
      
     
      setItemState({  dietaryType: "", category: "" }); 
      setImageState(null); 
      formElement.reset(); 
      setFieldDisabilty(true); 
      
    } catch (err) {
      console.error(err);
      triggerNotification("Failed to delete item", "error");
    }
  }

  const labelClass = "text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block";
  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-orange-500 text-sm font-medium outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm sticky top-24">
      <NotificationPopup {...notification} />
      
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
        Update Food Item
      </h3>

      <form className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full" onSubmit={(e) => e.preventDefault()}>

        {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
        <div
          onClick={() => fileInputRef.current.click()}
          className={`lg:col-span-2 relative w-full h-48 min-h-75 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${imageState ? 'border-orange-500 bg-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-orange-400'}`}
        >
          {imageState ? (
            <>
              <img src={imageState} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <p className="text-white font-bold text-sm bg-white/20 border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">Change Image</p>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 group-hover:text-orange-500 transition-colors">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 group-hover:shadow-md transition-all border border-slate-100 group-hover:border-orange-100">
                <IoCloudUploadOutline className="text-5xl opacity-80" />
              </div>
            </div>
          )}
        </div>

        <input name="image" disabled={fieldDisability} ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageChange} />

        {/* --- RIGHT COLUMN: INPUT FIELDS --- */}
        <div className="lg:col-span-2 flex flex-col gap-5 justify-between">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>UID</span>
              <input disabled={!fieldDisability}
                ref={uidRef}
                type="text"
                name="itemUID"
                placeholder="Item UID"
                className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Tag</span>
              <input value={itemState?.tag || ""} onChange={(e) => setItemState({ ...itemState, tag: e.target.value })} disabled={fieldDisability} name="tag" type="text" placeholder="TAG" className={inputClass} />
            </div>
          </div>

          <div>
            <span className={labelClass}>Name</span>
            <input value={itemState?.name || ""} onChange={(e) => setItemState({ ...itemState, name: e.target.value })} disabled={fieldDisability} name="name" type="text" placeholder="Item Name" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>Price</span>
              <input
                name="price"
                min={1}
                value={itemState.price || ""} onChange={(e) => setItemState({ ...itemState, price: e.target.value })} disabled={fieldDisability} type="number" placeholder="Price" className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Category</span>
              <select
                name="category"
                onChange={(e) => setItemState({ ...itemState, category: e.target.value })}
                value={itemState?.category || ""}
                disabled={fieldDisability} className={`${inputClass} cursor-pointer text-slate-600`}>
                {foodCategories && foodCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>Stock</span>
              <input
                name="quantity"
                min={0}
                value={itemState.quantity || ""} onChange={(e) => setItemState({ ...itemState, quantity: e.target.value })} disabled={fieldDisability} type="number" placeholder="Default Stock" className={inputClass} />
            </div>
            <div>
              <span className={labelClass}>Type</span>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-transparent">
                <label className="flex-1 text-center cursor-pointer">
                  <input onClick={() => setItemState({ ...itemState,  dietaryType: "Veg" })} checked={itemState.dietaryType === "Veg"} disabled={fieldDisability} type="radio" name="dietaryType" value="Veg" className="peer hidden" />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-green-600 peer-checked:shadow-sm transition-all">VEG</span>
                </label>
                <label className="flex-1 text-center cursor-pointer">
                  <input onClick={() => setItemState({ ...itemState,  dietaryType: "Non-Veg" })} checked={itemState.dietaryType === "Non-Veg"} disabled={fieldDisability} type="radio" name="dietaryType" value="Non-Veg" className="peer hidden" />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-red-500 peer-checked:shadow-sm transition-all">NON-VEG</span>
                </label>

                <label className="flex-1 text-center cursor-pointer">
                  <input onClick={() => setItemState({ ...itemState,  dietaryType: "Egg" })} checked={itemState.dietaryType === "Egg"} disabled={fieldDisability} type="radio" name="dietaryType" value="Egg" className="peer hidden" />
                  <span className="block py-2 text-xs font-bold text-slate-400 rounded-lg peer-checked:bg-white peer-checked:text-amber-900 peer-checked:shadow-sm transition-all">EGG</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <span className={labelClass}>Highlights</span>
            <input name="highlights" value={itemState?.highlights || ""} onChange={(e) => setItemState({ ...itemState, highlights: e.target.value })} disabled={fieldDisability} type="text" placeholder="Highlights (comma separated)" className={inputClass} />
          </div>

          <div className="pt-2 mt-auto">
            <button
              onClick={fieldDisability ? handleProceed : formState == "UPDATE" ? handleUpdate : handleDelete}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <IoAdd className="text-xl" /> {fieldDisability ? "Proceed" : (formState === "UPDATE" ? "Update" : "Delete")}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};