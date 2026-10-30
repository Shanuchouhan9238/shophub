import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductList from "../components/ProductList";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const LIMIT = 12;

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "price-asc", label: "Price -- Low to High" },
  { value: "price-desc", label: "Price -- High to Low" },
  { value: "rating-desc", label: "Rating" },
  { value: "discount-desc", label: "Discount" },
];

// Filters ki default value
const DEFAULT_FILTERS = {
  category: "",
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  brands: [],
  minDiscount: 0,
  inStock: false,
};

function ProductsPage() {
  // Search (q), category aur sort URL se aate hain (navbar search / home page links)
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "default";

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, category: categoryParam });
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Note: URL badalne par (navbar search / home link) App.jsx is page ko
  // naye key ke saath mount karta hai, isliye filters apne aap reset ho jate hain

  // Categories ek baar load honge
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Search ya category badle to API se saare matching products laate hain (limit 0 = sab)
  // Baaki filters (price, rating, brand...) browser mein lagte hain
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({
          search: searchQuery,
          category: filters.category,
          limit: 0,
        });
        if (!ignore) setAllProducts(data.products);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [searchQuery, filters.category, reloadKey]);

  // Brand list loaded products se
  const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].sort();

  // Client side filters
  let filtered = allProducts.filter((p) => {
    if (filters.minPrice !== "" && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice !== "" && p.price > Number(filters.maxPrice)) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (p.discountPercentage < filters.minDiscount) return false;
    if (filters.inStock && p.stock === 0) return false;
    return true;
  });

  // Sorting
  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === "rating-desc") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sort === "discount-desc") {
    filtered = [...filtered].sort((a, b) => b.discountPercentage - a.discountPercentage);
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / LIMIT);
  const products = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const showingFrom = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const showingTo = Math.min(page * LIMIT, total);

  // Applied filter chips
  const chips = [];
  const activeCategory = categories.find((c) => c.slug === filters.category);
  if (activeCategory) {
    chips.push({ label: activeCategory.name, remove: () => handleFilterChange({ ...filters, category: "" }) });
  }
  if (filters.minPrice !== "" || filters.maxPrice !== "") {
    const label = `$${filters.minPrice || 0} - ${filters.maxPrice ? "$" + filters.maxPrice : "$10000+"}`;
    chips.push({ label, remove: () => handleFilterChange({ ...filters, minPrice: "", maxPrice: "" }) });
  }
  if (filters.minRating > 0) {
    chips.push({ label: `${filters.minRating}★ & above`, remove: () => handleFilterChange({ ...filters, minRating: 0 }) });
  }
  filters.brands.forEach((brand) => {
    chips.push({
      label: brand,
      remove: () => handleFilterChange({ ...filters, brands: filters.brands.filter((b) => b !== brand) }),
    });
  });
  if (filters.minDiscount > 0) {
    chips.push({ label: `${filters.minDiscount}% or more`, remove: () => handleFilterChange({ ...filters, minDiscount: 0 }) });
  }
  if (filters.inStock) {
    chips.push({ label: "In Stock", remove: () => handleFilterChange({ ...filters, inStock: false }) });
  }

  function handleFilterChange(newFilters) {
    // Category badle to brand selection reset
    if (newFilters.category !== filters.category) {
      newFilters = { ...newFilters, brands: [] };
    }
    setFilters(newFilters);
    setPage(1);
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    // URL se bhi category hata do, search rehne do
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{activeCategory ? activeCategory.name : "All Products"}</span>
        {searchQuery && (
          <>
            <span>›</span>
            <span>"{searchQuery}"</span>
          </>
        )}
      </div>

      <div className="products-layout">
        <FilterSidebar
          categories={categories}
          brands={brands}
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          activeCount={chips.length}
        />
        {showFilters && (
          <div className="filter-overlay" onClick={() => setShowFilters(false)} />
        )}

        <div className="products-main">
          {/* Top bar: result count + sort */}
          <div className="results-bar">
            <div className="results-text">
              <h1>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : activeCategory
                    ? activeCategory.name
                    : "All Products"}
              </h1>
              {!loading && !error && (
                <span>
                  Showing {showingFrom} – {showingTo} of {total} results
                </span>
              )}
            </div>

            <div className="sort-bar">
              <span className="sort-label">Sort By</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`sort-option ${sort === opt.value ? "active" : ""}`}
                  onClick={() => handleSortChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button className="filter-toggle" onClick={() => setShowFilters(true)}>
                Filters {chips.length > 0 && `(${chips.length})`}
              </button>
            </div>
          </div>

          {/* Applied filter chips */}
          {chips.length > 0 && (
            <div className="chips">
              {chips.map((chip) => (
                <button key={chip.label} className="chip" onClick={chip.remove}>
                  {chip.label} <span>✕</span>
                </button>
              ))}
              <button className="chip-clear" onClick={handleClearFilters}>
                Clear all
              </button>
            </div>
          )}

          {loading && <Loader />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              message={
                searchQuery
                  ? `We couldn't find anything for "${searchQuery}". Try a different keyword or remove some filters.`
                  : "No products match the selected filters. Try removing some filters."
              }
            />
          )}

          {!loading && !error && products.length > 0 && <ProductList products={products} />}

          {!loading && !error && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
