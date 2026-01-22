import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useAppContext();

  const [Files, SetFiles] = useState([]);
  const [name, SetName] = useState("");
  const [description, SetDescription] = useState("");
  const [category, SetCategory] = useState("");
  const [price, SetPrice] = useState("");
  const [offerPrice, SetOfferPrice] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // ✅ start loader

    try {
      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      for (let i = 0; i < Files.length; i++) {
        formData.append("images", Files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);

        SetName("");
        SetDescription("");
        SetCategory("");
        SetPrice("");
        SetOfferPrice("");
        SetFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error in ADD Product API:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // ✅ stop loader after toast path
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updateFiles = [...Files];
                      updateFiles[index] = e.target.files[0];
                      SetFiles(updateFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      Files[index]
                        ? URL.createObjectURL(Files[index])
                        : assets.upload_area
                    }
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            onChange={(e) => SetName(e.target.value)}
            value={name}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Description
          </label>
          <textarea
            onChange={(e) => SetDescription(e.target.value)}
            value={description}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            onChange={(e) => SetCategory(e.target.value)}
            value={category}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              onChange={(e) => SetPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              onChange={(e) => SetOfferPrice(e.target.value)}
              value={offerPrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`
            px-8 py-2.5 rounded font-medium text-white
            flex items-center justify-center gap-2
            ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary"}
          `}
        >
          {loading && (
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          )}
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
