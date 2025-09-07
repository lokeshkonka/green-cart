/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, axios, navigate, setSeller } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ lowercase password

  const OnSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // ✅ send correct key "password"
      const { data } = await axios.post('/api/seller/login', { email, password });

      if (data.success) {
         toast.success(data.message || "Seller logged in successfully ✅");
        setSeller(true);
        navigate('/seller');
      } else {
         toast.error(data.message || "Invalid seller credentials ❌");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, []);

  return !isSeller && (
    <form onSubmit={OnSubmitHandler}
      className='min-h-screen flex items-center text-sm text-gray-600'
    >
      <div
        className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-500'
      >
        <p className='text-2xl font-medium m-auto'>
          Seller <span className='text-primary'>Login</span>
        </p>

        <div>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)} value={email}
            type="email" placeholder='Enter Your Email'
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)} value={password}
            type="password" placeholder='Enter the Password'
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
            required
          />
        </div>

        <button
          className='bg-primary text-white w-full py-2 mt-1 rounded-md cursor-pointer'
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default SellerLogin
