const BASE_URL ="https://dummyjson.com";

// Har request yahin se jayegi, error handling ek jagah
async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// GET /products, /products/search?q=..., /products/category/{slug}
export function getProducts({
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  limit = 12,
  skip = 0,
} = {}) {
  let path = "/products";

  if (search) {
    path = "/products/search";
  } else if (category) {
    path = `/products/category/${category}`;
  }

  const params = new URLSearchParams();
  if (search) params.set("q", search);
  params.set("limit", limit);
  params.set("skip", skip);
  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return request(`${BASE_URL}${path}?${params.toString()}`);
}

// GET /products/categories
export function getCategories() {
  return request(`${BASE_URL}/products/categories`);
}

// GET /products/{id}
export function getProductById(id) {
  return request(`${BASE_URL}/products/${id}`);
}