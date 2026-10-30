function EmptyState({ message = "No products found." }) {
  return (
    <div className="state-box">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <circle cx="52" cy="52" r="34" fill="#e3edff" stroke="#2874f0" strokeWidth="5" />
        <path d="m78 78 24 24" stroke="#2874f0" strokeWidth="8" strokeLinecap="round" />
        <path d="M40 44q12-10 24 0M38 60h28" stroke="#2874f0" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
      <h3>Sorry, no results found!</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
