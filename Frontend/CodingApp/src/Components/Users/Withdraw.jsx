import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const WithdrawWalletPage = () => {
  const [amount, setAmount] = useState(100);
  const [password, setPassword] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleWithdraw = async () => {
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }
    if (amount <= 0) {
      setMessage("Enter a valid amount greater than zero.");
      return;
    }
    if (!upiId) {
      setMessage("Please enter your UPI ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/wallet/withdraw-money",
        {
          userId: user.id,
          password,
          amount
        }
      );

      if (response.data.success) {
        setMessage(`Withdrawal successful! New balance: ₹${response.data.newBalance}`);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            walletBalance: response.data.newBalance,
          })
        );
      } else {
        setMessage("Withdrawal failed.");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Withdrawal failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
     <div className="min-h-screen bg-white pt-24 px-6 md:px-20">
    <div className="flex flex-col items-center text-blue-800">
      <h1 className="text-2xl font-bold mb-4">Withdraw Money via UPI</h1>
      <input
        type="number"
        placeholder="Amount (INR)"
        className="border p-2 mb-3"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Enter UPI ID"
        className="border p-2 mb-3"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        className="border p-2 mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleWithdraw}
        disabled={loading}
        className="bg-blue-800 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Withdraw"}
      </button>
      {message && <p className="mt-4">{message}</p>}
      <br />
      <Link to="/profile" className="bg-blue-800 text-white px-4 py-2 rounded">
        Back
      </Link>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default WithdrawWalletPage;
