import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const RegisterContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const razorpaykey=import.meta.env.VITE_RAZORPAY_KEY_ID;


  useEffect(() => {
    const fetchContestAndWallet = async () => {
      try {
        const [contestRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/cont/contests/${id}`),
          axios.get(`http://localhost:5000/api/users/${user.id}`),
        ]);
        setContest(contestRes.data.contest);
        setWalletBalance(userRes.data.walletBalance);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch contest or wallet data.");
      } finally {
        setLoading(false);
      }
    };
    fetchContestAndWallet();
  }, [id, user.id]);

  const loadRazorpay = async () => {
    if (walletBalance < contest.entryFee) {
      setInsufficientFunds(true);
      return;
    }
    setInsufficientFunds(false);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => setError("Razorpay SDK failed to load.");
    script.onload = () => initiatePayment();
    document.body.appendChild(script);
  };

  const initiatePayment = async () => {
    try {
      const orderRes = await axios.post("http://localhost:5000/api/wallet/create-order", {
        amount: contest.entryFee,
      });

      const options = {
        key: razorpaykey,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "VinCode",
        description: `Registering for ${contest.title}`,
        order_id: orderRes.data.id,
        handler: async (response) => {
          await axios.post(`http://localhost:5000/cont/contests/${id}/register`, {
            userId: user.id,
            paymentId: response.razorpay_payment_id,
          });
          navigate(`/contest/${id}`);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: {
          color: "#1E3A8A",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError("Payment initiation failed.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto mt-20 bg-white shadow rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Register for {contest.title}</h2>
        <p className="text-gray-700 mb-2">
          Entry Fee: <strong>₹{contest.entryFee}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          Your Wallet Balance: <strong>₹{walletBalance}</strong>
        </p>
        <button
          onClick={loadRazorpay}
          className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
        >
          Pay & Register
        </button>
        {insufficientFunds && (
          <p className="text-red-600 mt-4 font-semibold">
            Insufficient wallet balance. Please top up your wallet.
          </p>
        )}
      </div>
      <br />
      <Link
        to={`/contest/${id}`}
        className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold align-middle"
      >
        Back
      </Link>
    </>
  );
};

export default RegisterContest;
