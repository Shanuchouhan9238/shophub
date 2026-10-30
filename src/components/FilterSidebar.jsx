import { useState } from "react";

// Price dropdown ke options
const PRICE_OPTIONS = [0, 50, 100, 200, 500, 1000, 5000, 10000];

// Ek section jo open/close ho sakta hai
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-group">
      <button
        type="button"
        className="filter-group-head"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className={`chevron ${open ? "up" : ""}`}>⌄</span>
      </button>
      {open && <div className="filter-group-body">{children}</div>}
    </div>
  );
}

// Flipkart jaisa left side filter panel
function FilterSidebar({
  categories,
  brands,
  filters,
  onChange,
  onClear,
  isOpen,
  onClose,
  activeCount,
}) {
  const [brandSearch, setBrandSearch] = useState("");

  const update = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const toggleBrand = (brand) => {
    if (filters.brands.includes(brand)) {
      update("brands", filters.brands.filter((b) => b !== brand));
    } else {
      update("brands", [...filters.brands, brand]);
    }
  };

  const visibleBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
      <div className="filter-head">
        <h2>Filters</h2>
        {activeCount > 0 && (
          <button type="button" className="clear-all" onClick={onClear}>
            Clear All
          </button>
        )}
        <button type="button" className="filter-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Categories">
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={filters.category === ""}
            onChange={() => update("category", "")}
          />
          <span>All Categories</span>
        </label>
        <div className="filter-scroll">
          {categories.map((cat) => (
            <label className="filter-option" key={cat.slug}>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => update("category", cat.slug)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <input
          type="range"
          className="price-slider"
          min="0"
          max="10000"
          step="50"
          value={filters.maxPrice === "" ? 10000 : filters.maxPrice}
          onChange={(e) =>
            update("maxPrice", e.target.value === "10000" ? "" : e.target.value)
          }
        />
        <div className="price-selects">
          <select
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
          >
            <option value="">Min</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                ${p}
              </option>
            ))}
          </select>
          <span>to</span>
          <select
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
          >
            {PRICE_OPTIONS.filter((p) => p > 0).map((p) => (
              <option key={p} value={p}>
                ${p}
              </option>
            ))}
            <option value="">$10000+</option>
          </select>
        </div>
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <input
            type="text"
            className="brand-search"
            placeholder="Search Brand"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
          />
          <div className="filter-scroll">
            {visibleBrands.map((brand) => (
              <label className="filter-option" key={brand}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
            {visibleBrands.length === 0 && (
              <p className="filter-empty">No brand found</p>
            )}
          </div>
        </FilterSection>
      )}

      {/* Rating */}
      <FilterSection title="Customer Ratings">
        {[4, 3, 2, 1].map((star) => (
          <label className="filter-option" key={star}>
            <input
              type="checkbox"
              checked={filters.minRating === star}
              onChange={() => update("minRating", filters.minRating === star ? 0 : star)}
            />
            <span>
              {star}
              <span className="star-small">★</span> &amp; above
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount">
        {[5, 10, 15, 20].map((d) => (
          <label className="filter-option" key={d}>
            <input
              type="checkbox"
              checked={filters.minDiscount === d}
              onChange={() => update("minDiscount", filters.minDiscount === d ? 0 : d)}
            />
            <span>{d}% or more</span>
          </label>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => update("inStock", e.target.checked)}
          />
          <span>Exclude Out of Stock</span>
        </label>
      </FilterSection>

      <div className="filter-footer">
        <button type="button" className="btn-orange full-btn" onClick={onClose}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;
