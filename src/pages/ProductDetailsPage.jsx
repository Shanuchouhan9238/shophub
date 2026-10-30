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
    setMessage("Added to cart");
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
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;
  const originalPrice = product.discountPercentage
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>›</span>
        <span className="current">{product.title}</span>
      </div>

      <div className="details">
        {/* Left: images + buttons */}
        <div className="details-left">
          <div className="details-gallery">
            {product.images && product.images.length > 1 && (
              <div className="details-thumbs">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className={index === activeImage ? "active" : ""}
                    onMouseEnter={() => setActiveImage(index)}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
            <div className="details-main-image">
              <img
                src={product.images?.[activeImage] || product.thumbnail}
                alt={product.title}
              />
            </div>
          </div>

          <div className="details-buttons">
            <button className="btn-yellow" onClick={handleAddToCart} disabled={outOfStock}>
              🛒 Add to Cart
            </button>
            <button className="btn-orange" onClick={handleBuyNow} disabled={outOfStock}>
              ⚡ Buy Now
            </button>
          </div>
          {message && <p className="success-msg">{message}</p>}
        </div>

        {/* Right: info */}
        <div className="details-info">
          <span className="product-brand">{product.brand || product.category}</span>
          <h1>{product.title}</h1>

          <div className="rating-row">
            <span className="rating-badge">
              {product.rating} <span className="star">★</span>
            </span>
            <span className="rating-count">
              {product.reviews?.length || 0} Ratings &amp; Reviews
            </span>
            {product.rating >= 4.5 && <span className="assured">Assured</span>}
          </div>

          {originalPrice && <p className="special-price">Special price</p>}
          <div className="price-row big">
            <span className="price">${product.price}</span>
            {originalPrice && (
              <>
                <span className="old-price">${originalPrice.toFixed(0)}</span>
                <span className="off">{Math.round(product.discountPercentage)}% off</span>
              </>
            )}
          </div>

          <div className="offers">
            <h3>Available offers</h3>
            <ul>
              <li>
                <span className="offer-tag">Bank Offer</span> 5% cashback on ShopHub Credit Card
              </li>
              <li>
                <span className="offer-tag">Special Price</span> Get extra {Math.round(product.discountPercentage)}% off (price inclusive of discount)
              </li>
              <li>
                <span className="offer-tag">Free Delivery</span> On all orders, no minimum value
              </li>
            </ul>
          </div>

          <div className="info-grid">
            <span className="info-label">Delivery</span>
            <span>
              <strong>{product.shippingInformation || "Ships in 3-5 business days"}</strong>
              <br />
              <span className="green">Free delivery</span>
            </span>

            <span className="info-label">Availability</span>
            <span className={outOfStock ? "red" : "green"}>
              {outOfStock ? "Out of Stock" : `In Stock (${product.stock} left)`}
            </span>

            <span className="info-label">Quantity</span>
            <span className="qty-box">
              <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>
                −
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}
                disabled={qty >= product.stock}
              >
                +
              </button>
            </span>

            <span className="info-label">Highlights</span>
            <ul className="highlights">
              {product.warrantyInformation && <li>{product.warrantyInformation}</li>}
              {product.returnPolicy && <li>{product.returnPolicy}</li>}
              {product.minimumOrderQuantity && (
                <li>Minimum order quantity: {product.minimumOrderQuantity}</li>
              )}
              {product.weight && <li>Weight: {product.weight} g</li>}
            </ul>

            <span className="info-label">Description</span>
            <p>{product.description}</p>
          </div>

          <div className="spec-box">
            <h3>Specifications</h3>
            <table className="spec-table">
              <tbody>
                {product.brand && (
                  <tr>
                    <td>Brand</td>
                    <td>{product.brand}</td>
                  </tr>
                )}
                <tr>
                  <td>Category</td>
                  <td className="cap">{product.category}</td>
                </tr>
                {product.sku && (
                  <tr>
                    <td>SKU</td>
                    <td>{product.sku}</td>
                  </tr>
                )}
                {product.dimensions && (
                  <tr>
                    <td>Dimensions</td>
                    <td>
                      {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                    </td>
                  </tr>
                )}
                {product.warrantyInformation && (
                  <tr>
                    <td>Warranty</td>
                    <td>{product.warrantyInformation}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="reviews">
              <h3>Ratings &amp; Reviews</h3>
              {product.reviews.map((review, index) => (
                <div className="review" key={index}>
                  <div className="review-top">
                    <span className="rating-badge small">
                      {review.rating} <span className="star">★</span>
                    </span>
                    <strong>{review.comment}</strong>
                  </div>
                  <p className="review-meta">
                    {review.reviewerName} · {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
