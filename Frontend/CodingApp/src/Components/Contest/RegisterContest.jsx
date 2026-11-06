
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const RegisterContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContestAndWallet = async () => {
      try {
        const [contestRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/cont/contests/${id}`),
          axios.get(`http://localhost:5000/api/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
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
  }, [id]);

  const handleRegister = async () => {
    if (walletBalance < contest.entryFee) {
      alert("Insufficient wallet balance. Please add money to your wallet.");
      return;
    }

    setRegistering(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/cont/contests/${id}/register`,
        {
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newBalance = response.data.newBalance;

        setWalletBalance(newBalance);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            walletBalance: newBalance,
          })
        );

        alert("Successfully registered for the contest!");

        navigate(`/contest/${id}`);
      }
    } catch (err) {
      console.error("Contest registration failed:", err);

      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      if (message.includes("Insufficient")) {
        alert(message);
      } else {
        setError(message);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (error && !contest) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  if (!contest) return null;

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-xl mx-auto mt-20 bg-white shadow rounded-lg text-center">

        <h2 className="text-2xl font-bold mb-4">
          Register for {contest.title}
        </h2>

        <p className="text-gray-700 mb-2">
          Entry Fee: <strong>₹{contest.entryFee}</strong>
        </p>

        <p className="text-gray-700 mb-4">
          Your Wallet Balance: <strong>₹{walletBalance}</strong>
        </p>

        <button
          onClick={handleRegister}
          disabled={registering}
          className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          {registering ? "Processing..." : "Pay & Register"}
        </button>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        {walletBalance < contest.entryFee && (
          <p className="text-red-600 mt-4 font-semibold">
            Insufficient wallet balance. Please top up your wallet.
          </p>
        )}

      </div>

      <br />

      <Link
        to={`/contest/${id}`}
        className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
      >
        Back
      </Link>
    </>
  );
};

export default RegisterContest;
