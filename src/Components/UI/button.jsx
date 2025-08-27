const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-800',
      secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    };
    return <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</button>;
  };

export default Button;