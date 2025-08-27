import { NavLink } from "react-router-dom";
import { Store, ShoppingCart, User, Package } from "lucide-react";

const Header = () => (
    <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-2 rounded-lg">
                        <Package className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">E-commerce</span>
                </div>
                <nav className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-full p-1.5 shadow-sm">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <ShoppingCart size={16} /> Khách hàng
                    </NavLink>
                    <NavLink 
                        to="/shop"
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <Store size={16} /> Cửa hàng
                    </NavLink>
                    <NavLink 
                        to="/admin"
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <User size={16} /> Admin
                    </NavLink>
                </nav>
            </div>
        </div>
    </header>
);

export default Header;