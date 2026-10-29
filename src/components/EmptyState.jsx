function EmptyState({ message = "No products found." }) {
  return (
    <div className="state-box">
      <h3>No results</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;