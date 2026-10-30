import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="container page">
      <div className="state-box">
        <h1 className="big-404">404</h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn-blue">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
