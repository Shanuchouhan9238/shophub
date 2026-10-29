import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cartItems, updateQty, removeFromCart, clearCart, totalItems, totalPrice } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Cart khali hai to message dikhao
  if (cartItems.length === 0) {
    return (
      <div className="container page">
        <div className="state-box">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart first.</p>
          <Link to="/products" className="btn">
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Your Cart ({totalItems} items)</h1>

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />

              <div className="cart-item-info">
                <Link to={`/products/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <p className="muted">${item.price} each</p>
              </div>

              <div className="cart-item-actions">
                <div className="qty-box">
                  <button
                    className="secondary"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    disabled={item.qty === 1}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    className="secondary"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="product-price">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-links">
            <Link to="/products">← Continue Shopping</Link>
            <button className="remove-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="summary-box">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="green">Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="full-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
