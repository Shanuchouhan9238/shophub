// Flipkart / Meesho jaisa left side filter panel
function FilterSidebar({
  categories,
  brands,
  filters,
  onChange,
  onClear,
  isOpen,
  onClose,
}) {
  // Ek filter ki value badalne ke liye
  const update = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  // Brand checkbox toggle
  const toggleBrand = (brand) => {
    if (filters.brands.includes(brand)) {
      update(
        "brands",
        filters.brands.filter((b) => b !== brand)
      );
    } else {
      update("brands", [...filters.brands, brand]);
    }
  };

  return (
    <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
      <div className="filter-head">
        <h2>Filters</h2>
        <button className="link-btn" onClick={onClear}>
          Clear All
        </button>
        <button className="filter-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Category */}
      <div className="filter-group">
        <h3>Category</h3>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={filters.category === ""}
            onChange={() => update("category", "")}
          />
          All Categories
        </label>
        {categories.map((cat) => (
          <label className="filter-option" key={cat.slug}>
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.slug}
              onChange={() => update("category", cat.slug)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="filter-group">
        <h3>Price</h3>
        <div className="price-inputs">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </div>
        <div className="price-quick">
          <button
            type="button"
            className={filters.minPrice === "" && filters.maxPrice === "50" ? "active" : ""}
            onClick={() => onChange({ ...filters, minPrice: "", maxPrice: "50" })}
          >
            Under $50
          </button>
          <button
            type="button"
            className={filters.minPrice === "50" && filters.maxPrice === "200" ? "active" : ""}
            onClick={() => onChange({ ...filters, minPrice: "50", maxPrice: "200" })}
          >
            $50 - $200
          </button>
          <button
            type="button"
            className={filters.minPrice === "200" && filters.maxPrice === "1000" ? "active" : ""}
            onClick={() => onChange({ ...filters, minPrice: "200", maxPrice: "1000" })}
          >
            $200 - $1000
          </button>
          <button
            type="button"
            className={filters.minPrice === "1000" && filters.maxPrice === "" ? "active" : ""}
            onClick={() => onChange({ ...filters, minPrice: "1000", maxPrice: "" })}
          >
            Above $1000
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <h3>Customer Rating</h3>
        {[4, 3, 2, 1].map((star) => (
          <label className="filter-option" key={star}>
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === star}
              onChange={() => update("minRating", star)}
            />
            <span className="product-rating">★ {star}</span>&nbsp;& above
          </label>
        ))}
        <label className="filter-option">
          <input
            type="radio"
            name="rating"
            checked={filters.minRating === 0}
            onChange={() => update("minRating", 0)}
          />
          Any rating
        </label>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="filter-group">
          <h3>Brand</h3>
          <div className="filter-scroll">
            {brands.map((brand) => (
              <label className="filter-option" key={brand}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Discount */}
      <div className="filter-group">
        <h3>Discount</h3>
        {[0, 5, 10, 15].map((d) => (
          <label className="filter-option" key={d}>
            <input
              type="radio"
              name="discount"
              checked={filters.minDiscount === d}
              onChange={() => update("minDiscount", d)}
            />
            {d === 0 ? "Any discount" : `${d}% or more`}
          </label>
        ))}
      </div>

      {/* Availability */}
      <div className="filter-group">
        <h3>Availability</h3>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => update("inStock", e.target.checked)}
          />
          In stock only
        </label>
      </div>

      <button className="full-btn apply-btn" onClick={onClose}>
        Show Results
      </button>
    </aside>
  );
}

export default FilterSidebar;
