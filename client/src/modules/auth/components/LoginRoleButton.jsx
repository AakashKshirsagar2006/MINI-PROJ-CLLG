const LoginRoleButton = ({ children, onClickHandler, role, forRole }) => {
  return (
    <button
      onClick={onClickHandler}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition duration-200 ${role === forRole ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
    >
      {children}
      <span className="text-xs font-bold">{forRole.toUpperCase()}</span>
    </button>
  )
}

export default LoginRoleButton;