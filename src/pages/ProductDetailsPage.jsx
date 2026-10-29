import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Product ki details /products/{id} se aayengi
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(id);
        if (!ignore) {
          setProduct(data);
          setActiveImage(0);
          setQty(1);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="details">
        {/* Left side: images */}
        <div className="details-gallery">
          <img
            className="details-main-image"
            src={product.images?.[activeImage] || product.thumbnail}
            alt={product.title}
          />
          {product.images && product.images.length > 1 && (
            <div className="details-thumbs">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  className={index === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right side: info */}
        <div className="details-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>
          {product.brand && <p className="details-brand">by {product.brand}</p>}

          <div className="details-meta">
            <span className="product-price big">${product.price}</span>
            <span className="product-rating">★ {product.rating}</span>
            {product.discountPercentage > 0 && (
              <span className="discount">{product.discountPercentage}% off</span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
          </p>

          <div className="details-actions">
            <label>
              Qty:
              <input
                type="number"
                min="1"
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
              />
            </label>
            <button onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart
            </button>
            <button
              className="secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          {message && <p className="success-msg">{message}</p>}

          <ul className="details-list">
            {product.warrantyInformation && (
              <li>Warranty: {product.warrantyInformation}</li>
            )}
            {product.shippingInformation && (
              <li>Shipping: {product.shippingInformation}</li>
            )}
            {product.returnPolicy && <li>Return Policy: {product.returnPolicy}</li>}
          </ul>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews">
          <h2>Customer Reviews</h2>
          <div className="review-list">
            {product.reviews.map((review, index) => (
              <div className="review" key={index}>
                <div className="review-top">
                  <strong>{review.reviewerName}</strong>
                  <span className="product-rating">★ {review.rating}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;
