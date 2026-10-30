import { Link } from "react-router-dom";

// ShopHub ka logo: bag icon + naam + tagline
function Logo() {
  return (
    <Link to="/" className="logo">
      <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#ffffff" />
        <path d="M18 24h28l-3 24H21z" fill="#ffe500" />
        <path
          d="M24 24v-4a8 8 0 0 1 16 0v4"
          fill="none"
          stroke="#2874f0"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="27" cy="36" r="2.5" fill="#2874f0" />
        <circle cx="37" cy="36" r="2.5" fill="#2874f0" />
      </svg>
      <span className="logo-text">
        <span className="logo-name">ShopHub</span>
        <span className="logo-tagline">
          Shop <em>Smart</em> <span className="logo-star">✦</span>
        </span>
      </span>
    </Link>
  );
}

export default Logo;
