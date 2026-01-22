import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, removeFromCart, addToCart, cartItems, navigate } =
    useAppContext();

  if (!product) return null;

  const productImage = product.imagesURL?.[0] || "/fallback-image.png";
  const rating = product.rating || 4;
  const quantity = cartItems[product._id] || 0;

  const handleNavigate = () => {
    navigate(`/products/${product.category?.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleNavigate}
      className="
        group cursor-pointer
        rounded-xl border border-gray-200
        bg-white
        transition-all duration-200
        hover:border-primary/40 hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="flex items-center justify-center bg-gray-50 p-4 rounded-t-xl">
        <img
          src={productImage}
          alt={product.name || "Product"}
          className="
            h-40 w-full object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {product.category || "Uncategorized"}
        </p>

        {/* Name */}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.name || "Unnamed Product"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                src={i < rating ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className="h-3.5 w-3.5"
              />
            ))}
          <span className="text-xs text-gray-500 ml-1">
            ({rating})
          </span>
        </div>

        {/* Price + Action */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-primary">
              {currency}
              {product.offerPrice ?? 0}
            </span>
            {product.price && (
              <span className="text-xs text-gray-400 line-through">
                {currency}
                {product.price}
              </span>
            )}
          </div>

          {/* Cart */}
          <div onClick={(e) => e.stopPropagation()}>
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product._id)}
                className="
                  flex items-center gap-1.5
                  rounded-md border border-primary/40
                  bg-primary/10 px-3 py-1.5
                  text-xs font-medium text-primary
                  transition hover:bg-primary hover:text-white
                "
              >
                <img src={assets.cart_icon} alt="" className="h-4 w-4" />
                Add
              </button>
            ) : (
              <div
                className="
                  flex items-center gap-3
                  rounded-md bg-primary/15 px-3 py-1.5
                  text-primary
                "
              >
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-lg leading-none"
                >
                  −
                </button>
                <span className="min-w-[16px] text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-lg leading-none"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
