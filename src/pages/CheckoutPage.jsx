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
    state: "",
    pincode: "",
    payment: "cod",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  // Cart khali hai to checkout nahi
  if (cartItems.length === 0 && !placing) {
    return <Navigate to="/cart" />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      setError("Please fill all the fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
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

    setPlacing(true);

    const order = {
      id: "OD" + Date.now(),
      date: new Date().toISOString(),
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
      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* Left: steps */}
        <div className="checkout-steps">
          <div className="step-box">
            <div className="step-head">
              <span className="step-num">1</span>
              <h2>Delivery Address</h2>
            </div>
            <div className="step-body">
              <div className="form-two">
                <div className="form-row">
                  <label>Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                </div>
                <div className="form-row">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" />
                </div>
              </div>
              <div className="form-row">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              <div className="form-row">
                <label>Address (House No, Building, Street, Area)</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              </div>
              <div className="form-three">
                <div className="form-row">
                  <label>City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="form-row">
                  <label>State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" />
                </div>
                <div className="form-row">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" />
                </div>
              </div>
            </div>
          </div>

          <div className="step-box">
            <div className="step-head">
              <span className="step-num">2</span>
              <h2>Order Summary</h2>
            </div>
            <div className="step-body">
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="summary-item-info">
                    <span className="summary-title">{item.title}</span>
                    <span className="muted">Qty: {item.qty}</span>
                  </div>
                  <span className="price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="step-box">
            <div className="step-head">
              <span className="step-num">3</span>
              <h2>Payment Options</h2>
            </div>
            <div className="step-body">
              <label className="radio-row">
                <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={handleChange} />
                <span>Cash on Delivery</span>
              </label>
              <label className="radio-row">
                <input type="radio" name="payment" value="upi" checked={form.payment === "upi"} onChange={handleChange} />
                <span>UPI (Google Pay, PhonePe, Paytm)</span>
              </label>
              <label className="radio-row">
                <input type="radio" name="payment" value="card" checked={form.payment === "card"} onChange={handleChange} />
                <span>Credit / Debit / ATM Card</span>
              </label>
              <label className="radio-row">
                <input type="radio" name="payment" value="netbanking" checked={form.payment === "netbanking"} onChange={handleChange} />
                <span>Net Banking</span>
              </label>
              <p className="muted small">This is a demo store. No real payment is processed.</p>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Right: price details */}
        <div className="price-box">
          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Price ({totalItems} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className="green">Free</span>
          </div>
          <div className="summary-row total">
            <span>Total Payable</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button type="submit" className="btn-orange full-btn" disabled={placing}>
            {placing ? "Placing Order..." : "Confirm Order"}
          </button>
          <Link to="/cart" className="text-link center">
            ‹ Back to Cart
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
