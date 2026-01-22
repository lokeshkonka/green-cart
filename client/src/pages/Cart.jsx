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

  /* ======================
     PLACE ORDER
  ====================== */
  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    if (!selectedAddress) {
      toast.error("Select an address");
      return;
    }

    setLoading(true);
    try {
      const payload = {
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
        } else {
          toast.error(res.data.message);
        }
      } else {
        res = await axios.post("/api/order/stripe", payload);
        if (res.data.success && res.data.url) {
          window.location.replace(res.data.url);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     BUILD CART ARRAY
  ====================== */
  const buildCartArray = () => {
    const temp = [];
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) temp.push({ ...product, quantity: cartItems[id] });
    }
    setCartArray(temp);
  };

  /* ======================
     FETCH USER ADDRESSES
  ====================== */
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  /* ======================
     EFFECTS
  ====================== */
  useEffect(() => {
    if (products.length && Object.keys(cartItems).length) {
      buildCartArray();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  /* ======================
     EMPTY STATES
  ====================== */
  if (!Object.keys(cartItems).length)
    return (
      <div className="mt-20 text-center text-gray-400 text-lg">
        Your cart is empty.
      </div>
    );

  /* ======================
     UI
  ====================== */
  return (
    <div className="mt-20 flex flex-col lg:flex-row gap-12">
      {/* LEFT */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold mb-6">
          Shopping Cart{" "}
          <span className="text-primary text-sm">({getCartCount()})</span>
        </h1>

        <div className="space-y-5">
          {cartArray.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center gap-4 border p-4 rounded-lg"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={product.imagesURL?.[0]}
                  className="w-24 h-24 rounded object-cover cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/products/${product.category.toLowerCase()}/${product._id}`
                    )
                  }
                />

                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty:
                    <select
                      value={cartItems[product._id]}
                      onChange={(e) =>
                        updateCartItem(
                          product._id,
                          Number(e.target.value)
                        )
                      }
                      className="ml-2 border rounded"
                    >
                      {Array.from(
                        { length: Math.max(cartItems[product._id], 9) },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <p>
                  {currency}
                  {product.offerPrice * product.quantity}
                </p>
                <button onClick={() => removeFromCart(product._id)}>
                  <img src={assets.remove_icon} className="w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[360px] border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <p className="font-medium uppercase mb-2">Delivery Address</p>
        <p className="text-sm text-gray-600">
          {selectedAddress
            ? `${selectedAddress.street}, ${selectedAddress.city}`
            : "No address selected"}
        </p>

        <button
          onClick={() => setShowAddress(!showAddress)}
          className="text-primary text-sm mt-1"
        >
          Change
        </button>

        {showAddress && (
          <div className="mt-2 border bg-white rounded shadow">
            {Addresses.map((addr) => (
              <p
                key={addr._id}
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
              className="p-2 text-primary text-center cursor-pointer"
            >
              Add Address
            </p>
          </div>
        )}

        <div className="mt-4">
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="my-4" />

        <p className="flex justify-between">
          <span>Total</span>
          <span>
            {currency}
            {(getcartAmount() * 1.02).toFixed(2)}
          </span>
        </p>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full mt-6 py-3 bg-primary text-white rounded hover:bg-primary-dull disabled:opacity-50"
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
