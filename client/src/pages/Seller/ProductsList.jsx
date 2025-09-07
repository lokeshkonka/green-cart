import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductsList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-6 text-2xl font-semibold text-gray-800">
          🛍️ All Products
        </h2>

        <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-200">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Price</th>
                <th className="px-4 py-3 text-center">In Stock</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-600">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Product + Image */}
                    <td className="px-4 py-3 flex items-center space-x-4">
                      <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        {product.imagesURL?.length > 0 ? (
                          <img
                            src={product.imagesURL[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                      <span className="font-medium truncate">{product.name}</span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">{product.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3 hidden md:table-cell font-semibold text-gray-800">
                      {currency}
                      {product.offerPrice}
                    </td>

                    {/* In Stock Toggle */}
                    <td className="px-4 py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() => toggleStock(product._id, !product.inStock)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-md"></span>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
