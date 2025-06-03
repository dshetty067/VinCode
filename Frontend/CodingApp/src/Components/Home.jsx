import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-32 px-6 md:px-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight">
            Welcome to <span className="text-blue-800">VinCode</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700">
            The ultimate platform where{" "}
            <span className="font-semibold text-black">
              coding meets competition and rewards
            </span>
            .
          </p>
        </div>

        {/* Monetization Details */}
        <div className="mt-16 max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl shadow-md overflow-hidden">
            
            {/* Left: Text Content */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-4xl font-extrabold text-black mb-4">
                Features
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Join exciting coding contests, contribute a small entry fee to the prize pool, and win real money. VinCode rewards your skills instantly.
              </p>

              <ul className="space-y-4 text-gray-800 text-base">
                <li>💻 <span className="font-semibold text-blue-800">Real-time Coding Contests:</span> Compete and showcase your skills live.</li>
                <li>💸 <span className="font-semibold text-blue-800">Entry Fee System:</span> Every contest has an entry fee pooled into a prize.</li>
                <li>🏆 <span className="font-semibold text-blue-800">Winner Takes the Pool:</span> Top coders earn the prize pool (minus platform tax).</li>
                <li>👛 <span className="font-semibold text-blue-800">Wallet System:</span> Track your earnings and contest fees in your wallet.</li>
                <li>⚡ <span className="font-semibold text-blue-800">Instant Withdrawal:</span> Withdraw your winnings anytime to your bank or UPI.</li>
              </ul>

              <div className="mt-6">
                <Link
                  to="/contests"
                  className="inline-block bg-blue-800 text-white hover:bg-blue-600 px-6 py-3 rounded-md text-lg font-semibold transition"
                >
                  Explore Contests
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="md:w-1/2">
              <img
                src="/Coding.avif" // from public folder
                alt="Coding and Rewards"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <br />
      <Footer />
    </>
  );
};

export default Home;
