function SortSelect({ value, onChange }) {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="default">Sort by: Relevance</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating-desc">Rating: High to Low</option>
      <option value="discount-desc">Discount: High to Low</option>
    </select>
  );
}

export default SortSelect;
