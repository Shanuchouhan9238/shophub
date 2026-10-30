# ShopHub - E-commerce Website

A simple e-commerce website built with React and Vite. Products are loaded from the free [DummyJSON](https://dummyjson.com) API.

## Features

- **Landing Page** - Hero banner, feature highlights, shop by category and top rated products
- **Products Page** - Product listing with search, sorting, pagination and a Flipkart style left side filter panel
  - Filters: Category, Price range, Customer rating, Brand (multi select), Discount and In stock
  - Sort by price, rating or discount
  - On mobile the filter panel opens as a slide-in drawer
- **Product Details Page** - Image gallery, price, discount, stock, description, reviews, quantity, Add to Cart and Buy Now
- **Cart Page** - Update quantity, remove items, clear cart and order summary
- **Checkout Page** - Shipping details form with validation and payment method selection
- **Thank You Page** - Order confirmation with order ID, items and delivery address
- Cart is saved in localStorage, so it stays after page refresh
- Loading, error and empty states
- Fully responsive (mobile, tablet, desktop)

## Tech Stack

- React 19
- React Router DOM 7
- Vite
- Plain CSS
- DummyJSON API

## Pages / Routes

| Route            | Page                 |
| ---------------- | -------------------- |
| `/`              | Landing Page         |
| `/products`      | Products Listing     |
| `/products/:id`  | Product Details      |
| `/cart`          | Cart                 |
| `/checkout`      | Checkout             |
| `/thank-you`     | Thank You            |
| `*`              | 404 Not Found        |

## API Used

- `GET /products` - all products
- `GET /products/search?q=` - search products
- `GET /products/categories` - all categories
- `GET /products/category/{slug}` - products by category
- `GET /products/{id}` - single product details

## How to Run

1. Install dependencies

   ```
   npm install
   ```

2. Start the development server

   ```
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

### Other commands

```
npm run build     # production build in dist folder
npm run preview   # preview the production build
npm run lint      # check code with ESLint
```

## Project Structure

```
shophub/
├── public/
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx       # no results message
│   │   ├── ErrorMessage.jsx     # error message with retry
│   │   ├── FilterSidebar.jsx    # left side filters (category, price, rating, brand...)
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx           # loading spinner
│   │   ├── Navbar.jsx           # header with cart count
│   │   ├── Pagination.jsx
│   │   ├── ProductCard.jsx      # single product card
│   │   ├── ProductList.jsx      # product grid
│   │   ├── SearchBar.jsx
│   │   └── SortSelect.jsx       # sort dropdown
│   ├── context/
│   │   ├── CartContext.js       # cart context
│   │   └── CartProvider.jsx     # cart state (add, remove, update, clear)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ThankYouPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   └── api.js               # all API calls
│   ├── App.jsx                  # routes
│   ├── App.css                  # all styles
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## User Flow

1. Open the landing page and click **Shop Now**
2. Search, apply filters from the left panel or sort products on the products page
3. Click a product to open its details page
4. Choose quantity and click **Add to Cart** or **Buy Now**
5. Review items in the cart and click **Proceed to Checkout**
6. Fill in shipping details, pick a payment method and click **Place Order**
7. See the order confirmation on the thank you page

## Note

This is a demo project. No real payment is processed and orders are not saved on any server.
