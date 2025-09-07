import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { currency, removeFromCart, addToCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  const productImage = product.imagesURL?.[0] || '/fallback-image.png';
  const rating = product.rating || 4; // default rating if not present

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category?.toLowerCase()}/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white cursor-pointer"
    >
      {/* Product Image */}
      <div className="group flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={productImage}
          alt={product.name || 'Product'}
        />
      </div>

      {/* Product Info */}
      <div className="text-gray-500/60 text-sm mt-2">
        <p>{product.category || 'Uncategorized'}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name || 'Unnamed Product'}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < rating ? assets.star_icon : assets.star_dull_icon}
                alt={i < rating ? 'Star' : 'No Star'}
              />
            ))}
          <span className="ml-1 text-xs text-gray-500">({rating})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {currency}{product.offerPrice ?? 0}
            {product.price && (
              <span className="text-gray-500/60 md:text-sm text-xs line-through ml-1">
                {currency}{product.price}
              </span>
            )}
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            className="text-primary"
          >
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-primary-600 font-medium"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="Add to cart" />
                Add
              </button>
            ) : (
              <div className="cursor-pointer flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
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
