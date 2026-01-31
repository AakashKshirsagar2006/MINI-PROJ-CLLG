const AuthPageInputField = ({children, inputRef, type = "text", placeholder = "", required = true, disabled = false, isVisible=true}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700">
        {children}
      </label>
      <input
        ref={inputRef}
        disabled={disabled}
         required={required}
        type={type}
        placeholder={placeholder}
        className={`${isVisible?"block":"hidden"} w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition`}
      />
    </div>
  )
}

export default AuthPageInputField;