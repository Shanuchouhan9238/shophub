import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const LIMIT = 12;

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
  // Home page se category link par aane ke liye URL se category padhte hain
  const [searchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") || "",
  });
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Categories ek baar load honge
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Search ya category badle to API se saare matching products laate hain (limit 0 = sab)
  // Baaki filters (price, rating, brand...) yahin browser mein lagte hain
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

  // Loaded products se brand list nikalte hain (duplicate hata kar)
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
    filtered = [...filtered].sort(
      (a, b) => b.discountPercentage - a.discountPercentage
    );
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / LIMIT);
  const products = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  // Kitne filters lage hue hain (badge ke liye)
  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.brands.length +
    (filters.minDiscount > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setFilters({ ...filters, category: "", brands: [] });
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    // Category badle to brand list bhi badlegi, isliye brands reset
    if (newFilters.category !== filters.category) {
      newFilters = { ...newFilters, brands: [] };
    }
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="container page">
      <div className="products-layout">
        {/* Left side filters */}
        <FilterSidebar
          categories={categories}
          brands={brands}
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
        {showFilters && (
          <div className="filter-overlay" onClick={() => setShowFilters(false)} />
        )}

        {/* Right side products */}
        <div className="products-main">
          <h1 className="page-title">
            {activeCategory ? activeCategory.name : "All Products"}
          </h1>

          <div className="toolbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              onClear={handleClear}
            />
            <SortSelect value={sort} onChange={handleSortChange} />
            <button
              className="secondary filter-toggle"
              onClick={() => setShowFilters(true)}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {!loading && !error && (
            <p className="result-count">
              {total} products found
              {activeFilterCount > 0 && ` · ${activeFilterCount} filters applied`}
            </p>
          )}

          {loading && <Loader />}

          {!loading && error && (
            <ErrorMessage
              message={error}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              message={
                searchQuery
                  ? `No results for "${searchQuery}". Try a different keyword or clear filters.`
                  : "No products match the selected filters."
              }
            />
          )}

          {!loading && !error && products.length > 0 && (
            <ProductList products={products} />
          )}

          {!loading && !error && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
