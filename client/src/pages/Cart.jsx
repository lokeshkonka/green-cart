import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [Addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    setCartItems,
    user,
    axios,
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getcartAmount,
  } = useAppContext();

  /* ===== LOGIC UNCHANGED ===== */

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Select an Address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        userId: user?._id,
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      };

      let res;
      if (paymentOption === "COD") {
        res = await axios.post("/api/order/cod", payload);
        if (res.data.success) {
          toast.success(res.data.message);
          setCartItems({});
          navigate("/my-orders");
        } else toast.error(res.data.message);
      } else {
        res = await axios.post("/api/order/stripe", payload);
        if (res.data.success && res.data.url) {
          window.location.replace(res.data.url);
        } else toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((i) => i._id === key);
      if (product) tempArray.push({ ...product, quantity: cartItems[key] });
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get", {
        params: { userId: user?._id },
      });
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0)
          setSelectedAddress(data.addresses[0]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (products.length && Object.keys(cartItems).length) getCart();
  }, [products, cartItems]);

  useEffect(() => {
    if (user?._id) getUserAddress();
  }, [user]);

  /* ===== UI ===== */

  if (loading)
    return (
      <div className="mt-20 text-center text-gray-500">Loading...</div>
    );

  if (error)
    return (
      <div className="mt-20 text-center text-red-500">{error}</div>
    );

  if (!Object.keys(cartItems).length)
    return (
      <div className="mt-20 text-center text-gray-400 text-lg">
        Your cart is empty.
      </div>
    );

  return (
    <div className="mt-20 flex flex-col lg:flex-row gap-12">
      {/* ================= LEFT ================= */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold mb-6">
          Shopping Cart{" "}
          <span className="text-primary text-sm">
            ({getCartCount()})
          </span>
        </h1>

        <div className="space-y-5">
          {cartArray.map((product, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between gap-4
                rounded-lg border border-gray-200 p-4
                hover:shadow-sm transition
              "
            >
              {/* Product */}
              <div className="flex gap-4 items-center">
                <img
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${product._id}`
                    );
                    scrollTo(0, 0);
                  }}
                  src={product.imagesURL?.[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                />

                <div>
                  <p className="font-medium text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Qty:
                    <select
                      value={cartItems[product._id]}
                      onChange={(e) =>
                        updateCartItem(
                          product._id,
                          Number(e.target.value)
                        )
                      }
                      className="ml-2 border border-gray-300 rounded px-1"
                    >
                      {Array.from(
                        { length: Math.max(cartItems[product._id], 9) },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </p>
                </div>
              </div>

              {/* Price + Remove */}
              <div className="flex items-center gap-6">
                <p className="font-medium text-gray-700">
                  {currency}
                  {product.offerPrice * product.quantity}
                </p>
                <button onClick={() => removeFromCart(product._id)}>
                  <img
                    src={assets.remove_icon}
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-8 flex items-center gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            className="rotate-180"
          />
          Continue Shopping
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="w-full lg:w-[360px] border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-medium uppercase mb-1">
              Delivery Address
            </p>
            <p>
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "No address selected"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary text-sm mt-1"
            >
              Change
            </button>

            {showAddress && (
              <div className="mt-2 border rounded bg-white shadow">
                {Addresses.map((addr, i) => (
                  <p
                    key={i}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addr.street}, {addr.city}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="p-2 text-primary text-center hover:bg-primary/10 cursor-pointer"
                >
                  Add Address
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-medium uppercase mb-1">
              Payment Method
            </p>
            <select
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-2 text-gray-700 text-sm">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getcartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getcartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>
              {currency}
              {(getcartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="
            w-full mt-6 py-3 rounded
            bg-primary text-white font-medium
            hover:bg-primary-dull transition
            disabled:opacity-50
          "
        >
          {paymentOption === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
