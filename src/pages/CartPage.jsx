import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cartItems, updateQty, removeFromCart, totalItems, totalPrice } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Cart khali hai
  if (cartItems.length === 0) {
    return (
      <div className="container page">
        <div className="state-box">
          <svg viewBox="0 0 120 120" width="130" height="130" aria-hidden="true">
            <path d="M20 30h14l10 48h48l8-34H40" fill="none" stroke="#2874f0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="94" r="6" fill="#2874f0" />
            <circle cx="84" cy="94" r="6" fill="#2874f0" />
            <path d="M58 52h20M68 42v20" stroke="#ffe500" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <h3>Your cart is empty!</h3>
          <p>Add items to it now.</p>
          <Link to="/products" className="btn-blue">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  // Original price (discount se pehle) nikalne ke liye
  const originalTotal = cartItems.reduce((sum, item) => {
    const original = item.discountPercentage
      ? item.price / (1 - item.discountPercentage / 100)
      : item.price;
    return sum + original * item.qty;
  }, 0);
  const savings = originalTotal - totalPrice;

  return (
    <div className="container page">
      <div className="cart-layout">
        {/* Left: items */}
        <div className="cart-box">
          <div className="cart-box-head">
            <h2>My Cart ({totalItems})</h2>
          </div>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <Link to={`/products/${item.id}`} className="cart-item-img">
                <img src={item.thumbnail} alt={item.title} />
              </Link>

              <div className="cart-item-body">
                <Link to={`/products/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <span className="cart-item-brand">{item.brand || ""}</span>
                <div className="price-row">
                  <span className="price">${(item.price * item.qty).toFixed(2)}</span>
                  {item.discountPercentage > 0 && (
                    <>
                      <span className="old-price">
                        ${((item.price / (1 - item.discountPercentage / 100)) * item.qty).toFixed(0)}
                      </span>
                      <span className="off">{Math.round(item.discountPercentage)}% off</span>
                    </>
                  )}
                </div>
                <span className="free-delivery">Free delivery</span>

                <div className="cart-item-actions">
                  <div className="qty-box">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty === 1}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="text-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-box-foot">
            <Link to="/products" className="text-link">
              ‹ Continue Shopping
            </Link>
            <button className="btn-orange" onClick={() => navigate("/checkout")}>
              Place Order
            </button>
          </div>
        </div>

        {/* Right: price details */}
        <div className="price-box">
          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Price ({totalItems} items)</span>
            <span>${originalTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span className="green">− ${savings.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span>
              <span className="old-price">$5</span> <span className="green">Free</span>
            </span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <p className="savings">You will save ${savings.toFixed(2)} on this order</p>
          )}
          <p className="safe-note">
            🔒 Safe and Secure Payments. Easy returns. 100% Authentic products.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
