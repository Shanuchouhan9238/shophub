import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CheckoutPage() {
  const { cartItems, totalItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "cod",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  // Cart khali hai to checkout nahi, wapas cart page par
  if (cartItems.length === 0 && !placing) {
    return <Navigate to="/cart" />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      setError("Please fill all the fields.");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Phone number should be 10 digits.");
      return;
    }
    if (form.pincode.length !== 6) {
      setError("Pincode should be 6 digits.");
      return;
    }

    setError("");
    setPlacing(true);

    // Order ki details thank you page par bhejenge
    const order = {
      id: "ORD" + Date.now(),
      items: cartItems,
      totalItems: totalItems,
      totalPrice: totalPrice,
      customer: form,
    };

    clearCart();
    navigate("/thank-you", { state: { order: order } });
  };

  return (
    <div className="container page">
      <h1 className="page-title">Checkout</h1>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* Form */}
        <div className="checkout-form">
          <div className="form-box">
            <h2>Shipping Details</h2>

            <div className="form-row">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
              />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House no, street, area"
              />
            </div>

            <div className="form-two">
              <div className="form-row">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="form-row">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6 digit pincode"
                />
              </div>
            </div>
          </div>

          <div className="form-box">
            <h2>Payment Method</h2>
            <label className="radio-row">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={form.payment === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={form.payment === "upi"}
                onChange={handleChange}
              />
              UPI
            </label>
            <label className="radio-row">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={form.payment === "card"}
                onChange={handleChange}
              />
              Credit / Debit Card
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Summary */}
        <div className="summary-box">
          <h2>Order Summary</h2>
          <ul className="summary-items">
            {cartItems.map((item) => (
              <li key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <span className="summary-title">
                  {item.title} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
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
          <button type="submit" className="full-btn">
            Place Order
          </button>
          <Link to="/cart" className="back-link center">
            ← Back to Cart
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
