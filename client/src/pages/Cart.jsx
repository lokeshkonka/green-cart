import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
    const [showAddress, setShowAddress] = useState(false)
    const [cartArray, setCartArray] = useState([])
    const [Addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Context
    const {
        setCartItems,
        user,
        axios, // Make sure this is configured with correct baseURL
        products,
        currency,
        cartItems,
        removeFromCart,
        getCartCount,
        updateCartItem,
        navigate,
        getcartAmount
    } = useAppContext();

    // Place Order Handler
    const placeOrder = async () => {
        if (!selectedAddress) {
            toast.error("Select an Address");
            return;
        }
        setLoading(true);
        setError("");
        try {
            let res;
            const payload = {
                userId: user?._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id
            };
            if (paymentOption === "COD") {
                res = await axios.post('/api/order/cod', payload);
                if (res.data.success) {
                    toast.success(res.data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    setError(res.data.message || "Order failed");
                    toast.error(res.data.message || "Order failed");
                }
            } else {
                res = await axios.post('/api/order/stripe', payload);
                if (res.data.success && res.data.url) {
                    window.location.replace(res.data.url);
                } else {
                    setError(res.data.message || "Payment initiation failed");
                    toast.error(res.data.message || "Payment initiation failed");
                }
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Network error");
            toast.error(err?.response?.data?.message || err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    // Build cart items array from cartItems and products
    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((i) => i._id === key);
            if (product) {
                tempArray.push({ ...product, quantity: cartItems[key] });
            }
        }
        setCartArray(tempArray);
    };

    // Fetch user addresses
    const getUserAddress = async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.get('/api/address/get', {
                params: { userId: user?._id }
            });
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                setError(data.message);
                toast.error(data.message);
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Network error");
            toast.error(err?.response?.data?.message || err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (products.length > 0 && cartItems && Object.keys(cartItems).length > 0) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user && user._id) {
            getUserAddress();
        }
    }, [user]);

    // Render loading or error
    if (loading) {
        return <div className="mt-16 text-center text-lg text-gray-500">Loading...</div>;
    }
    if (error) {
        return <div className="mt-16 text-center text-red-500">{error}</div>;
    }

    // Main cart rendering
    return products.length > 0 && cartItems && Object.keys(cartItems).length > 0 ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()}</span>
                </h1>
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>
                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} className="cursor-pointer w-24 h-24 flex items-center justify-center">
                                <img className="max-w-full h-full object-cover" src={product.imagesURL?.[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select
                                            className='outline-none'
                                            value={cartItems[product._id]}
                                            onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                                        >
                                            {Array.from({ length: Math.max(cartItems[product._id], 9) }, (_, idx) => (
                                                <option key={idx} value={idx + 1}>{idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button
                            onClick={() => removeFromCart(product._id)}
                            className="cursor-pointer mx-auto"
                        >
                            <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => { navigate("/products"); scrollTo(0, 0) }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                >
                    <img className='group-hover:-translate-x-1 transition' src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>
            </div>
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}` : "NO ADDRESS FOUND"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-8 w-full bg-white border border-gray-300 rounded shadow-md z-10">
                                {Addresses.map((address, i) => (
                                    <p
                                        key={i}
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowAddress(false);
                                        }}
                                        className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                ))}
                                <p
                                    onClick={() => {
                                        navigate("/add-address");
                                        setShowAddress(false);
                                    }}
                                    className="p-2 text-primary text-center hover:bg-primary/10 cursor-pointer"
                                >
                                    Add Address
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select
                        onChange={e => setPaymentOption(e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>
                <hr className="border-gray-300" />
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getcartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{(getcartAmount() * 2 / 100).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>
                            {currency}{(getcartAmount() + getcartAmount() * 2 / 100).toFixed(2)}</span>
                    </p>
                </div>
                <button
                    onClick={placeOrder}
                    disabled={loading}
                    className={`w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : (
        <div className="mt-16 text-center text-lg text-gray-500">Your cart is empty.</div>
    );
};

export default Cart;
