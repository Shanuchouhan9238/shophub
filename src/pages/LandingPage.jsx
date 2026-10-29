import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Home page par 8 top rated products dikhayenge
  useEffect(() => {
    getProducts({ sortBy: "rating", order: "desc", limit: 8 })
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Kuch categories bhi dikhayenge
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.slice(0, 8)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to ShopHub</h1>
          <p>
            Shop the best products in beauty, electronics, fashion, home and
            more. Great prices and free delivery.
          </p>
          <Link to="/products" className="btn btn-white">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container section">
        <div className="features">
          <div className="feature">
            <h3>Free Shipping</h3>
            <p>On all orders, no minimum.</p>
          </div>
          <div className="feature">
            <h3>Easy Returns</h3>
            <p>30 days return policy.</p>
          </div>
          <div className="feature">
            <h3>Secure Payment</h3>
            <p>100% safe checkout.</p>
          </div>
          <div className="feature">
            <h3>24/7 Support</h3>
            <p>We are always here to help.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container section">
        <div className="section-head">
          <h2>Shop by Category</h2>
          <Link to="/products">View all</Link>
        </div>
        <div className="category-list">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="category-chip"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Top products */}
      <section className="container section">
        <div className="section-head">
          <h2>Top Rated Products</h2>
          <Link to="/products">View all</Link>
        </div>
        {loading ? <Loader /> : <ProductList products={products} />}
      </section>
    </div>
  );
}

export default LandingPage;
