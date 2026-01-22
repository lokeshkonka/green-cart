/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, SetsearchQuery] = useState("");

  /* ======================
     FETCH SELLER
  ====================== */
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setSeller(!!data.success);
    } catch {
      setSeller(false);
    }
  };

  /* ======================
     FETCH USER
  ====================== */
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  /* ======================
     FETCH PRODUCTS
  ====================== */
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ======================
     CART ACTIONS (LOCAL)
  ====================== */
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      if (copy[itemId] > 1) copy[itemId]--;
      else delete copy[itemId];
      return copy;
    });
  };

  /* ======================
     CART HELPERS
  ====================== */
  const getCartCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getcartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return Math.floor(total * 100) / 100;
  };

  /* ======================
     INITIAL LOAD
  ====================== */
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  /* ======================
     SYNC CART TO BACKEND
     (ONLY WHEN LOGGED IN)
  ====================== */
  useEffect(() => {
    if (!user || !user._id) return;

    const syncCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (err) {
        console.error("Cart sync failed:", err.message);
      }
    };

    syncCart();
  }, [cartItems, user]);

  const value = {
    axios,
    user,
    isSeller,
    products,
    currency,
    cartItems,
    searchQuery,
    showUserLogin,
    setShowUserLogin,
    setSeller,
    setUser,
    setCartItems,
    SetsearchQuery,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getcartAmount,
    navigate,
    fetchProducts,
    fetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
