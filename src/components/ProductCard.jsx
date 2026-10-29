import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      {/* Card par click karne se details page khulega */}
      <Link to={`/products/${product.id}`} className="product-link">
        <img src={product.thumbnail} alt={product.title} />
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.title}</h3>
          <div className="product-bottom">
            <span className="product-price">${product.price}</span>
            <span className="product-rating">★ {product.rating}</span>
          </div>
        </div>
      </Link>

      <button className="add-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
