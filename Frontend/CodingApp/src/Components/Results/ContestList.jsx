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
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cont/contests/active");
        const now = new Date();
        const filteredContests = response.data.contests.filter(contest => {
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);

  // ongoing: started but not ended yet
  if (start <= now && now < end) return true;

  // completed: ended already
  if (end <= now) return true;

  // otherwise (upcoming), exclude
  return false;
});
        setContests(filteredContests);
      } catch (err) {
        setError(err.message || "Failed to fetch contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 px-6 md:px-20">
         {!isLoggedIn ? (
          <h2 className="text-2xl font-bold text-gray mb-10 text-center">
            Please Sign In to View the Contests
          </h2>
        ) : (
          <>
        <h1 className="text-4xl font-extrabold text-black mb-10 text-center">
          Active & Completed Contests Results
        </h1>

        {loading && <p className="text-center text-gray-500">Loading contests...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{contest.title}</h2>
              <p className="text-gray-700 mb-4">{contest.description || "No description"}</p>

              <ul className="text-gray-600 space-y-1 mb-4">
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
                  <span className="font-semibold">Prize Pool:</span> ₹{contest.prizePool}
                </li>
                <li>
                  <span className="font-semibold">Bonus from App:</span> ₹{contest.bonusFromApp}
                </li>
               
              </ul>

              <div className="flex justify-between">
               

               
                  <Link
                    to={`/topWinners/${contest._id}`}
                    className="inline-block bg-green-600 text-white hover:bg-green-500 px-5 py-2 rounded-md font-medium transition"
                  >
                    View Winners
                  </Link>
               
              </div>
            </div>
          ))}

          {!loading && contests.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No active or completed contests available right now.
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
