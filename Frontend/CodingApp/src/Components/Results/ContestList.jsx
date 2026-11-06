import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useAuth } from "../../AuthContext";

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchCompletedContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cont/contests/completed");
        setContests(response.data.contests);
      } catch (err) {
        setError(err.message || "Failed to fetch completed contests");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedContests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 px-6 md:px-20">
        {!isLoggedIn ? (
          <h2 className="text-2xl font-bold text-gray-700 mb-10 text-center">
            Please Sign In to View Contest Results
          </h2>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold text-black mb-10 text-center">
              Completed Contests & Results
            </h1>

            {loading && <p className="text-center text-gray-500">Loading completed contests...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {contests.map((contest) => (
                <div
                  key={contest._id}
                  className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition bg-gray-50"
                >
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">{contest.title}</h2>
                  <p className="text-gray-700 mb-4">{contest.description || "No description"}</p>

                  <ul className="text-gray-600 space-y-1 mb-6">
                    <li>
                      <span className="font-semibold">Entry Fee:</span> ₹{contest.entryFee}
                    </li>
                    <li>
                      <span className="font-semibold">Start Time:</span>{" "}
                      {new Date(contest.startTime).toLocaleString()}
                    </li>
                    <li>
                      <span className="font-semibold">End Time:</span>{" "}
                      {new Date(contest.endTime).toLocaleString()}
                    </li>
                    <li>
                      <span className="font-semibold">Final Prize Pool:</span> ₹{contest.prizePool}
                    </li>
                    <li>
                      <span className="font-semibold">Bonus from App:</span> ₹{contest.bonusFromApp}
                    </li>
                  </ul>

                  <div className="text-center">
                    <Link
                      to={`/topWinners/${contest._id}`}
                      className="inline-block bg-green-600 text-white hover:bg-green-500 px-5 py-2 rounded-md font-medium transition shadow"
                    >
                      View Winners & Results
                    </Link>
                  </div>
                </div>
              ))}

              {!loading && contests.length === 0 && (
                <p className="text-center text-gray-500 col-span-full">
                  No completed contests found in the database yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ContestList;