function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box error-box">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button className="btn-blue" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorMessage;
