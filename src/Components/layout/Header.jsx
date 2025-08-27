import { NavLink } from "react-router-dom";
import { ShoppingCart, Store, User, Package } from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header-outer">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <Package className="header-logo__icon" strokeWidth={2.5} />
          </div>
          <span className="header-title">E-commerce Platform</span>
        </div>

        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `header-link ${isActive ? 'header-link--active' : ''}`}
          >
            <ShoppingCart className="header-link__icon" />
            Khách hàng
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) => `header-link ${isActive ? 'header-link--active' : ''}`}
          >
            <Store className="header-link__icon" />
            Cửa hàng
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `header-link ${isActive ? 'header-link--active' : ''}`}
          >
            <User className="header-link__icon" />
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}