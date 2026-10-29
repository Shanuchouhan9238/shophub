import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortSelect from "../components/SortSelect";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const LIMIT = 12;

function ProductsPage() {
  // Home page se category link par aane ke liye URL se category padhte hain
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Categories ek baar load honge
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Jab bhi search, category, sort ya page badle, products dobara aayenge
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const sortBy = sort === "default" ? "" : "price";
        const order = sort === "price-desc" ? "desc" : "asc";

        const data = await getProducts({
          search: searchQuery,
          category,
          sortBy,
          order,
          limit: LIMIT,
          skip: (page - 1) * LIMIT,
        });

        if (!ignore) {
          setProducts(data.products);
          setTotal(data.total);
        }
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
  }, [searchQuery, category, sort, page, reloadKey]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setCategory("");
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSearchInput("");
    setSearchQuery("");
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

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="container page">
      <h1 className="page-title">All Products</h1>

      <div className="toolbar">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={handleCategoryChange}
        />
        <SortSelect value={sort} onChange={handleSortChange} />
      </div>

      {!loading && !error && total > 0 && (
        <p className="result-count">{total} products found</p>
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
              ? `No results for "${searchQuery}". Try a different keyword.`
              : "No products found."
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
  );
}

export default ProductsPage;
