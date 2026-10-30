import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col">
          <h4>About</h4>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <span>Payments</span>
          <span>Shipping</span>
          <span>Cancellation &amp; Returns</span>
          <span>FAQ</span>
        </div>
        <div className="footer-col">
          <h4>Policy</h4>
          <span>Return Policy</span>
          <span>Terms of Use</span>
          <span>Security</span>
          <span>Privacy</span>
        </div>
        <div className="footer-col footer-contact">
          <h4>Mail Us</h4>
          <p>
            ShopHub Internet Private Limited,
            <br />
            Tower A, Tech Park,
            <br />
            Jaipur, Rajasthan 302001
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>Become a Seller</span>
          <span>Advertise</span>
          <span>Gift Cards</span>
          <span>Help Center</span>
          <span className="footer-copy">© 2026 ShopHub.com</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
