import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const formatRemainingTime = (endTime) => {
  if (!endTime) return null;
  const diffMs = new Date(endTime).getTime() - Date.now();
  if (Number.isNaN(diffMs)) return null;
  if (diffMs <= 0) return "00:00:00";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

const ContestQuestionsPage = () => {
  const { id } = useParams(); // Contest ID
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchContestAndQuestions = async () => {
      try {
        const userIdQuery = currentUserId ? `?userId=${currentUserId}` : "";
        const [questionsRes, contestRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/qn/contest-questions/${id}${userIdQuery}`
          ),
          axios.get(`http://localhost:5000/cont/contests/${id}`).catch(() => null),
        ]);

        setQuestions(questionsRes.data.questions || []);

        const contestEndTime = contestRes?.data?.contest?.endTime;
        if (contestEndTime) {
          setEndTime(contestEndTime);
          setTimeLeft(formatRemainingTime(contestEndTime));
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user !== undefined) {
      fetchContestAndQuestions();
    }
  }, [id, user, currentUserId]);

  useEffect(() => {
    if (!endTime) return;

    setTimeLeft(formatRemainingTime(endTime));
    const interval = setInterval(() => {
      setTimeLeft(formatRemainingTime(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const solvedCount = questions.filter((q) => Boolean(q.isSolved)).length;
  const totalCount = questions.length;

  const handleFinishContest = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to finish this contest? Your submissions will be judged and the contest will be marked complete."
    );
    if (!confirmed) return;

    try {
      setMessage("Processing submissions...");

      await axios.post(
        `http://localhost:5000/judge/judge-submissions/${id}/${currentUserId}`
      );
      await axios.post(`http://localhost:5000/cont/mark-complete`, {
        contestId: id,
        userId: currentUserId,
      });

      setMessage("Contest finished successfully. Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error finishing contest:", err);
      setMessage("Failed to finish contest.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading questions...</p>;

  return (
    <>
      <Navbar />
      <div className="w-full px-4 sm:px-6 mt-20">
        {/* Top Row: Far Top-Left Back Button & Far Top-Right Time Left Icon */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            type="button"
            onClick={() => navigate(`/contest/${id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold border border-gray-300 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-amber-700"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Time Left: {timeLeft ?? "--:--:--"}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Note Above Card */}
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-950">
            <strong>Note :</strong> Code can be submitted only once for a
            question, and your submissions are judged and evaluated only after you
            finish the contest.
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            {/* Top Header with Title + Live Icon on Left, Solved Card + Finish Button on Right */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-blue-800">
                  Contest Questions
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-sm font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Solved: {solvedCount} / {totalCount}
                  </span>
                </div>

                <button
                  onClick={handleFinishContest}
                  className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-md font-semibold transition"
                >
                  Finish Contest
                </button>
              </div>
            </div>

            {/* Status Message Banner */}
            {message && (
              <div className="mb-6 p-3 bg-blue-50 text-blue-800 rounded-md font-medium text-sm border border-blue-200">
                {message}
              </div>
            )}

            {questions.length === 0 ? (
              <p className="text-gray-600">
                No questions found for this contest.
              </p>
            ) : (
              <ul className="space-y-6">
                {questions.map((q, index) => (
                  <li
                    key={q._id}
                    className="border p-4 rounded-md bg-gray-50 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-black mb-1">
                      Q{index + 1}: {q.title}
                    </h2>
                    <p className="text-gray-700">{q.description}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Difficulty:</strong>{" "}
                      <span className="capitalize">{q.difficulty}</span>
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/question/${q._id}?contestId=${id}`)
                        }
                        disabled={q.isSolved}
                        className={`px-4 py-2 rounded-md text-sm text-white ${
                          q.isSolved
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-500"
                        }`}
                      >
                        {q.isSolved ? "Solved" : "Solve"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestQuestionsPage;