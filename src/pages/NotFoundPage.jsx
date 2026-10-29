import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="container page">
      <div className="state-box">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
