
const Input = ({ type = 'text', placeholder, value, onChange, className = '' }) => (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${className}`} />
  );

export default Input;