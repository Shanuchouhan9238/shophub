import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  // Page refresh ke baad bhi cart bacha rahe, isliye localStorage se shuru karte hain
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Jab bhi cart badle, localStorage mein save kar do
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Product add karo, agar pehle se hai to quantity badhao
  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
          qty: qty,
        },
      ]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, qty: qty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Total items aur total price
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
