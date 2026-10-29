import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { totalItems } = useContext(CartContext);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          ShopHub
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">
            Cart {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
