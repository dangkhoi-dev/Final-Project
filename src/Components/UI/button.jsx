const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 transform active:scale-95';
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
  };
  return <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</button>;
};
export default Button;