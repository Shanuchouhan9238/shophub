function Pagination({ page, totalPages, onPageChange }) {
  const maxButtons = 5;
  let end = Math.min(totalPages, Math.max(1, page - 2) + maxButtons - 1);
  let start = Math.max(1, end - maxButtons + 1);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <span className="page-info">
        Page {page} of {totalPages}
      </span>

      <div className="page-buttons">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
