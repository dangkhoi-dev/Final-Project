import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Store, User } from "lucide-react";

const Header = () => (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Package className="h-8 w-8 text-slate-800" />
                    <span className="ml-3 text-xl font-bold text-slate-800">E-commerce Platform</span>
                </div>
                <nav className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <NavLink 
                        to="/" 
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 hover:bg-slate-200"
                        activeClassName="bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <ShoppingCart size={16} /> Khách hàng
                    </NavLink>
                    <NavLink 
                        to="/shop"
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 hover:bg-slate-200"
                        activeClassName="bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <Store size={16} /> Cửa hàng
                    </NavLink>
                    <NavLink 
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 hover:bg-slate-200"
                        activeClassName="bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <User size={16} /> Admin
                    </NavLink>
                </nav>
            </div>
        </div>
    </header>
);

export default Header;