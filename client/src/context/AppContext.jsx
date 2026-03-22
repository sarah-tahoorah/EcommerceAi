import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("glamora_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const addToCart = (product, qty = 1, size = "M") => {
    setCart((prev) => {
      const found = prev.find((i) => i._id === product._id && i.size === size);
      if (found) return prev.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...product, qty, size }];
    });
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const value = useMemo(
    () => ({
      cart,
      setCart,
      wishlist,
      toggleWishlist,
      addToCart,
      dark,
      setDark,
      user,
      setUser
    }),
    [cart, wishlist, dark, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
