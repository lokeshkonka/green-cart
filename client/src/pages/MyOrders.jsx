/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user, currency, axios } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user", {
        params: { userId: user._id },
      });
      if (data.success) {
        setMyOrders(data.orders || []);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16 px-4 md:px-12">
      {/* Header */}
      <div className="flex flex-col items-start mb-8">
        <p className="text-3xl font-semibold uppercase text-gray-800">
          My Orders
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-gray-500 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {myOrders.map((order, index) => (
            <div
              key={order._id || index}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm 
              transform transition duration-300 hover:scale-[1.02] hover:shadow-lg 
              animate-[pop_0.4s_ease-out]"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "backwards",
              }}
            >
              {/* Order Info */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 border-b pb-4">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Order ID:</span> {order._id}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Payment:</span>{" "}
                  {order.paymentType}
                </p>
                <p className="text-gray-800 font-semibold">
                  Total: {currency}
                  {order.amount}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b last:border-b-0 pb-4"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl">
                          <img
                            src={item?.product?.imagesURL?.[0] || "/placeholder.png"}
                            alt={item?.product?.name || "Unknown Product"}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-medium text-gray-800">
                            {item?.product?.name || "Unknown Product"}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Category: {item?.product?.category || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Status & Amount */}
                      <div className="flex flex-col md:items-end gap-1">
                        <p className="text-gray-600 text-sm">
                          Quantity: {item?.quantity || 1}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Status:{" "}
                          <span className="text-primary font-medium">
                            {order.status}
                          </span>
                        </p>
                        <p className="text-gray-600 text-sm">
                          Date:{" "}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-primary text-base font-semibold mt-1">
                          {currency}
                          {item?.product?.offerPrice
                            ? item.product.offerPrice * (item.quantity || 1)
                            : 0}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items in this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Keyframes */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
