
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const ContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/cont/contests/${id}`);
        setContest(res.data.contest);
        console.log("userId:", userId, "participants:", res.data.contest.participants);
        setIsRegistered(
          Array.isArray(res.data.contest.participants) &&
          res.data.contest.participants.some(
            participant => participant._id.toString() === userId.toString()
          )
        );
        console.log("Completed Users:", res.data.contest.completedUsers);
        setHasCompleted(
          Array.isArray(res.data.contest.completedUsers) &&
          res.data.contest.completedUsers.includes(userId.toString())
        );
      } catch (err) {
        console.error("Failed to fetch contest:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, userId]);

  useEffect(() => {
  console.log('isRegistered changed:', isRegistered);
}, [isRegistered]);

 useEffect(() => {
  console.log('hasCompleted changed:', hasCompleted);
}, [hasCompleted]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = () => {
    const start = new Date(contest.startTime);
    const diff = start - now;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!contest) return <p className="text-center mt-20 text-red-600">Contest not found.</p>;

  const hasStarted = now >= new Date(contest.startTime);
  const hasEnded = now >= new Date(contest.endTime);
  const timeRemaining = getTimeRemaining();

return (
  <>
    <Navbar />
   
    <div className="p-6 max-w-3xl mx-auto mt-20 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{contest.title}</h1>
      <p className="mb-4 text-gray-700">{contest.description}</p>
      <ul className="space-y-2 text-gray-800">
        <li><strong>Entry Fee:</strong> ₹{contest.entryFee}</li>
        <li><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</li>
        <li><strong>End Time:</strong> {new Date(contest.endTime).toLocaleString()}</li>
        <li><strong>Prize Pool:</strong> ₹{contest.prizePool}</li>
        <li><strong>Bonus from App:</strong> ₹{contest.bonusFromApp}</li>
        <li><strong>Max Participants:</strong> {contest.maxParticipants}</li>
        <li><strong>Remaining Slots:</strong> {contest.remainingSlots}</li>
        <li><strong>Status:</strong> {contest.status}</li>
      </ul>

      {hasEnded ? (
        <p className="mt-6 text-red-600 font-medium">This contest has ended.</p>
      ) : hasCompleted ? (
        <p className="mt-4 text-green-700 font-semibold">
          You have already completed this contest.
        </p>
      ) : hasStarted ? (
        isRegistered ? (
          <button
            onClick={() => navigate(`/contest/${id}/questions`)}
            className="mt-4 bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
          >
            View Questions
          </button>
        ) : (
          <button
            onClick={() => navigate(`/contests/${id}/register`)}
            className="mt-4 bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold"
          >
            Register for Contest
          </button>
        )
      ) : (
        <>
          <p className="mt-6 text-orange-600 font-medium">
            Starts in: {timeRemaining || "Starting soon..."}
          </p>
          {isRegistered ? (
            <p className="text-green-600 font-medium">Already Registered</p>
          ) : (
            <button
              onClick={() => navigate(`/contests/${id}/register`)}
              className="mt-4 bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold"
            >
              Register for Contest
            </button>
          )}
        </>
      )}
    </div>
  </>
);
}

export default ContestPage;
