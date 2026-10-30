import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Banner slides (Flipkart jaisa slider)
const BANNERS = [
  {
    title: "Big Savings Days",
    text: "Up to 20% off on top brands. Limited time offer.",
    btn: "Shop Deals",
    link: "/products?sort=discount-desc",
    color: "banner-blue",
  },
  {
    title: "Latest Smartphones",
    text: "Best prices on phones from top brands.",
    btn: "Explore Phones",
    link: "/products?category=smartphones",
    color: "banner-dark",
  },
  {
    title: "Beauty & Fragrances",
    text: "Fresh picks for your daily glow.",
    btn: "Shop Beauty",
    link: "/products?category=beauty",
    color: "banner-pink",
  },
];

function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  // Categories ke saath har category ki ek image bhi laate hain
  useEffect(() => {
    getCategories()
      .then(async (data) => {
        const firstEight = data.slice(0, 8);
        const withImages = await Promise.all(
          firstEight.map(async (cat) => {
            try {
              const res = await getProducts({ category: cat.slug, limit: 1 });
              return { ...cat, image: res.products[0]?.thumbnail };
            } catch {
              return cat;
            }
          })
        );
        setCategories(withImages);
      })
      .catch(() => setCategories([]));
  }, []);

  // Best deals aur top rated products
  useEffect(() => {
    Promise.all([
      getProducts({ sortBy: "discountPercentage", order: "desc", limit: 8 }),
      getProducts({ sortBy: "rating", order: "desc", limit: 8 }),
    ])
      .then(([dealData, ratedData]) => {
        setDeals(dealData.products);
        setTopRated(ratedData.products);
      })
      .catch(() => {
        setDeals([]);
        setTopRated([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Banner har 4 second mein apne aap badle
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[slide];

  return (
    <div className="container home">
      {/* Category strip */}
      <section className="category-strip">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}`}
            className="category-item"
          >
            <div className="category-img">
              {cat.image ? <img src={cat.image} alt={cat.name} /> : null}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </section>

      {/* Banner slider */}
      <section className={`banner ${banner.color}`}>
        <button
          className="banner-arrow left"
          onClick={() => setSlide((slide - 1 + BANNERS.length) % BANNERS.length)}
          aria-label="Previous banner"
        >
          ‹
        </button>
        <div className="banner-content">
          <h1>{banner.title}</h1>
          <p>{banner.text}</p>
          <Link to={banner.link} className="btn-white">
            {banner.btn}
          </Link>
        </div>
        <button
          className="banner-arrow right"
          onClick={() => setSlide((slide + 1) % BANNERS.length)}
          aria-label="Next banner"
        >
          ›
        </button>
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              className={i === slide ? "active" : ""}
              onClick={() => setSlide(i)}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Best deals row */}
      <section className="deals-box">
        <div className="deals-head">
          <h2>Best Deals</h2>
          <Link to="/products?sort=discount-desc" className="btn-blue small">
            View All
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="deals-row">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Top rated row */}
      <section className="deals-box">
        <div className="deals-head">
          <h2>Top Rated Products</h2>
          <Link to="/products?sort=rating-desc" className="btn-blue small">
            View All
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="deals-row">
            {topRated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <div>
            <h3>Free Delivery</h3>
            <p>On all orders</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon">↩</span>
          <div>
            <h3>Easy Returns</h3>
            <p>30 days return policy</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <div>
            <h3>Secure Payments</h3>
            <p>100% safe &amp; secure</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon">☎</span>
          <div>
            <h3>24/7 Support</h3>
            <p>We are here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
