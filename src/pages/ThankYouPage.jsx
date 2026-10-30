import { Link, useLocation } from "react-router-dom";

const PAYMENT_NAMES = {
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Credit / Debit Card",
  netbanking: "Net Banking",
};

function ThankYouPage() {
  const location = useLocation();
  // Checkout page se order ki details state mein aati hain
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container page">
        <div className="state-box">
          <h3>No order found</h3>
          <p>Please place an order first.</p>
          <Link to="/products" className="btn-blue">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const { customer } = order;

  // Delivery date: aaj se 4 din baad
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div className="container page">
      <div className="thankyou">
        <div className="thankyou-top">
          <div className="tick">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="muted">
            Thank you, {customer.name}. Your order has been confirmed and will be delivered
            by <strong>{deliveryDate.toDateString()}</strong>.
          </p>
          <p className="order-id">Order ID: {order.id}</p>
        </div>

        <div className="thankyou-grid">
          <div className="step-box">
            <div className="step-head">
              <h2>Items ({order.totalItems})</h2>
            </div>
            <div className="step-body">
              {order.items.map((item) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="summary-item-info">
                    <span className="summary-title">{item.title}</span>
                    <span className="muted">Qty: {item.qty}</span>
                  </div>
                  <span className="price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total Paid</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="step-box">
            <div className="step-head">
              <h2>Delivery Address</h2>
            </div>
            <div className="step-body address">
              <p>
                <strong>{customer.name}</strong>
              </p>
              <p>{customer.address}</p>
              <p>
                {customer.city}, {customer.state} - {customer.pincode}
              </p>
              <p>Phone: {customer.phone}</p>
              <p>Email: {customer.email}</p>
              <p className="muted">Payment: {PAYMENT_NAMES[customer.payment]}</p>
            </div>
          </div>
        </div>

        <div className="thankyou-actions">
          <Link to="/products" className="btn-blue">
            Continue Shopping
          </Link>
          <Link to="/" className="text-link">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
