import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import {
  FaMoneyBillWave,
  FaTrophy,
  FaUserFriends,
  FaRocket,
  FaWallet,
} from "react-icons/fa";

function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32 px-6 md:px-20">
        {/* About Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight">
            About <span className="text-blue-800">VinCode</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700">
            At <span className="font-semibold text-black">VinCode</span>, we believe coding should be fun, competitive, and rewarding.
          </p>
        </div>

        <div className="mt-16 max-w-5xl mx-auto bg-gray-50 p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-black mb-10">
            Why Choose <span className="text-blue-800">VinCode</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800 text-lg">
            {/* Contest Participation */}
            <div className="flex items-start gap-4">
              <FaRocket className="text-blue-700 text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">Real-Time Contests</h3>
                <p>
                  Join thrilling real-time coding contests, compete with top coders, and sharpen your problem-solving skills.
                </p>
              </div>
            </div>

            {/* Win Rewards */}
            <div className="flex items-start gap-4">
              <FaTrophy className="text-yellow-600 text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">Win Rewards</h3>
                <p>
                  Earn cash prizes for your performance in coding challenges and contests.
                </p>
              </div>
            </div>

            {/* Entry Fee & Prize Pool */}
            <div className="flex items-start gap-4">
              <FaMoneyBillWave className="text-green-600 text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">Entry Fee & Prize Pool</h3>
                <p>
                  Contests have a small entry fee that goes into a prize pool. Top coders take the pot (after platform tax).
                </p>
              </div>
            </div>

            {/* Instant Withdrawals */}
            <div className="flex items-start gap-4">
              <FaWallet className="text-indigo-700 text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">Instant Withdrawals</h3>
                <p>
                  Withdraw your earnings instantly and securely to your preferred payment method—no delays.
                </p>
              </div>
            </div>

            {/* Wallet System */}
            <div className="flex items-start gap-4">
              <FaWallet className="text-blue-600 text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800">Wallet System</h3>
                <p>
                  Easily track your earnings, entry fees, and transaction history in one centralized wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
}

export default About;
