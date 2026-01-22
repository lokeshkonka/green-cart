import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

/* ======================
   Input Field Component
====================== */
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full py-3.5 border border-gray-500/30 rounded outline-none focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ======================
     AUTH GUARD (SAFE)
  ====================== */
  useEffect(() => {
    if (user === null) {
      // wait for fetchUser to resolve
      setCheckingAuth(false);
      return;
    }

    if (!user) {
      toast.error("Please login to add an address");
      navigate("/cart");
    } else {
      setCheckingAuth(false);
    }
  }, [user, navigate]);

  if (checkingAuth) return null;

  /* ======================
     HANDLERS
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await axios.post("/api/address/add", { address });

      if (data.success) {
        toast.success(data.message || "Address added");
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Request failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email Address"
            />

            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="text"
                placeholder="Zipcode"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone"
            />

            <button
              type="submit"
              disabled={submitting}
              className={`
                w-full mt-6 py-3 uppercase font-medium
                text-white transition
                ${
                  submitting
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dull"
                }
              `}
            >
              {submitting ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-16 md:mt-0 max-w-sm"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
