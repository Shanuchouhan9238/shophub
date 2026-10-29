import { Link, useLocation } from "react-router-dom";

function ThankYouPage() {
  const location = useLocation();
  // Checkout page se order ki details state mein aati hain
  const order = location.state?.order;

  // Direct URL se aaye ho to order nahi milega
  if (!order) {
    return (
      <div className="container page">
        <div className="state-box">
          <h2>No order found</h2>
          <p>Please place an order first.</p>
          <Link to="/products" className="btn">
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="thankyou">
        <div className="tick">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="muted">
          Hi {order.customer.name}, your order has been placed successfully.
        </p>
        <p className="order-id">Order ID: {order.id}</p>

        <div className="thankyou-grid">
          <div className="form-box">
            <h2>Items ({order.totalItems})</h2>
            <ul className="summary-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <span className="summary-title">
                    {item.title} × {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="form-box">
            <h2>Delivery Address</h2>
            <p>{order.customer.name}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city} - {order.customer.pincode}
            </p>
            <p>Phone: {order.customer.phone}</p>
            <p>Email: {order.customer.email}</p>
            <p className="muted">
              Payment:{" "}
              {order.customer.payment === "cod"
                ? "Cash on Delivery"
                : order.customer.payment.toUpperCase()}
            </p>
          </div>
        </div>

        <Link to="/products" className="btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default ThankYouPage;
