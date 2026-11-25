import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="home-page min-h-screen">
        <section className="home-hero">
          <div className="home-hero-content">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              Think. Code. Compete.
            </p>
            <h1 className="mt-5">
              Your next big
              <br />
              coding win starts here.
            </h1>
            <p>
              Welcome to <span className="home-hero-brand font-semibold">VinCode</span> —
              the place where problem-solving meets friendly competition and real
              rewards.
            </p>
            <Link to="/contests" className="home-hero-link">
              Explore contests <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Built for ambitious coders
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
              Make every line count.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Sharpen your skills, take on real-time challenges, and get
              rewarded for the work you put in.
            </p>
          </div>

          <div className="home-feature-panel flex flex-col overflow-hidden rounded-2xl md:flex-row">
            <div className="p-8 md:w-1/2 md:p-12">
              <h3 className="text-2xl font-bold text-black md:text-3xl">
                Everything you need to compete
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Join coding contests, build your track record, and follow your
                rewards from registration to withdrawal.
              </p>

              <ul className="mt-7 space-y-4 text-gray-700">
                 <li>💻 <span className="font-semibold text-blue-800">Real-time Coding Contests:</span> Compete and showcase your skills live.</li>
                <li>💸 <span className="font-semibold text-blue-800">Entry Fee System:</span> Every contest has an entry fee pooled into a prize.</li>
                <li>🏆 <span className="font-semibold text-blue-800">Winner Takes the Pool:</span> Top coders earn the prize pool (minus platform tax).</li>
                <li>👛 <span className="font-semibold text-blue-800">Wallet System:</span> Track your earnings and contest fees in your wallet.</li>
                <li>⚡ <span className="font-semibold text-blue-800">Instant Withdrawal:</span> Withdraw your winnings anytime to your bank or UPI.</li>
          
              </ul>

              <Link
                to="/contests"
                className="mt-8 inline-flex items-center rounded-full bg-blue-800 px-6 py-3 font-semibold text-white hover:bg-blue-600"
              >
                Find your next challenge
              </Link>
            </div>

            <div className="min-h-72 overflow-hidden bg-orange-50 md:w-1/2">
              <img
                src="/Coding.avif"
                alt="A coding workspace"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
