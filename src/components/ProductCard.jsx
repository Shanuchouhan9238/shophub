import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

// Discount se pehle ki original price nikalte hain
function getOriginalPrice(product) {
  if (!product.discountPercentage) return null;
  return product.price / (1 - product.discountPercentage / 100);
}

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const originalPrice = getOriginalPrice(product);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-img-box">
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
          {product.discountPercentage >= 10 && (
            <span className="deal-tag">{Math.round(product.discountPercentage)}% off</span>
          )}
        </div>

        <div className="product-info">
          <span className="product-brand">{product.brand || product.category}</span>
          <h3 className="product-title">{product.title}</h3>

          <div className="rating-row">
            <span className="rating-badge">
              {product.rating} <span className="star">★</span>
            </span>
            <span className="rating-count">({product.reviews?.length || 0})</span>
            {product.rating >= 4.5 && <span className="assured">Assured</span>}
          </div>

          <div className="price-row">
            <span className="price">${product.price}</span>
            {originalPrice && (
              <>
                <span className="old-price">${originalPrice.toFixed(0)}</span>
                <span className="off">{Math.round(product.discountPercentage)}% off</span>
              </>
            )}
          </div>
          <span className="free-delivery">Free delivery</span>
        </div>
      </Link>

      <button
        className="add-btn"
        onClick={() => addToCart(product)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
