import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import Navbar from "../Navbar";
import Footer from "../Footer";

const AddWalletPage = () => {
  const [amount, setAmount] = useState(100);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const razorpaykey=import.meta.env.VITE_RAZORPAY_KEY_ID;

  const loadRazorpay = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/api/wallet/create-order",
        {amount}
      );

      const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        setMessage("Failed to load Razorpay SDK");
        setLoading(false);
        return;
      }

      const options = {
        key: razorpaykey,
        amount: order.amount,
        currency: "INR",
        name: "VinCode",
        description: 'Top Up your wallet & Start earning !!!',
        order_id: order.id,
        handler: async () => {
          try {
            const verify = await axios.post(
              "http://localhost:5000/api/wallet/verify-payment",
              {
                userId: user.id,
                password,
                amount,
              }
             
            );

            if (verify.data.success) {
              setMessage(`Wallet updated! New balance: ₹${verify.data.newBalance}`);
              // Optional: update localStorage user wallet balance
              localStorage.setItem("user", JSON.stringify({
                ...user,
                walletBalance: verify.data.newBalance
              }));
            } else {
              setMessage("Payment verified, but wallet update failed.");
            }
          } catch (error) {
            setMessage("Verification failed. Make sure your password is correct.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: {
          color: "#1E40AF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white pt-24 px-6 md:px-20">
    <div className="flex flex-col items-center text-blue-800">
      <h1 className="text-2xl font-bold mb-4">Add Money to Wallet</h1>
      <input
        type="number"
        placeholder="Amount (INR)"
        className="border p-2 mb-3"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <input
        type="password"
        placeholder="Enter password"
        className="border p-2 mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-800 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Add Money"}
      </button>
      {message && <p className="mt-4">{message}</p>}
      <br />
      <Link to="/profile" className="bg-blue-800 text-white px-4 py-2 rounded">Back</Link>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default AddWalletPage;
