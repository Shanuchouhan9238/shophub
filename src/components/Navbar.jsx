import { useContext, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Logo from "./Logo";

function Navbar() {
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(urlQuery);
  const [lastQuery, setLastQuery] = useState(urlQuery);

  // URL ka q badle (jaise home par jaane par) to search box bhi update ho
  if (urlQuery !== lastQuery) {
    setLastQuery(urlQuery);
    setSearch(urlQuery);
  }

  // Search karne par products page par le jao
  const handleSubmit = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (term) {
      navigate(`/products?q=${encodeURIComponent(term)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />

        <form className="nav-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" className="nav-cart">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            <span>Cart</span>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
