function SearchBar({ value, onChange, onSearch, onClear }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products (e.g. phone)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" className="secondary" onClick={onClear}>
        Clear
      </button>
    </form>
  );
}

export default SearchBar;