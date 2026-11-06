import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const ContestQuestionsPage = () => {
  const { id } = useParams(); // Contest ID
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userIdQuery = currentUserId ? `?userId=${currentUserId}` : "";
        const res = await axios.get(`http://localhost:5000/qn/contest-questions/${id}${userIdQuery}`);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user !== undefined) {
      fetchQuestions();
    }
  }, [id, user, currentUserId]);

  const handleFinishContest = async () => {
    try {
      setMessage('Processing submissions...');
      
      await axios.post(`http://localhost:5000/judge/judge-submissions/${id}/${currentUserId}`);
      await axios.post(`http://localhost:5000/cont/mark-complete`, {
        contestId: id,
        userId: currentUserId,
      });
      
      setMessage('Contest finished successfully. Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Error finishing contest:", err);
      setMessage('Failed to finish contest.');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading questions...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow rounded-lg">
        {/* Top Header with Title & Finish Contest Button */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-800">Contest Questions</h1>
          <button
            onClick={handleFinishContest}
            className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-md font-semibold transition"
          >
            Finish Contest
          </button>
        </div>

        {/* Status Message Banner */}
        {message && (
          <div className="mb-6 p-3 bg-blue-50 text-blue-800 rounded-md font-medium text-sm border border-blue-200">
            {message}
          </div>
        )}

        {questions.length === 0 ? (
          <p className="text-gray-600">No questions found for this contest.</p>
        ) : (
          <ul className="space-y-6">
            {questions.map((q, index) => (
              <li key={q._id} className="border p-4 rounded-md bg-gray-50 shadow-sm">
                <h2 className="text-xl font-semibold text-black mb-1">
                  Q{index + 1}: {q.title}
                </h2>
                <p className="text-gray-700">{q.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Difficulty:</strong> <span className="capitalize">{q.difficulty}</span>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => navigate(`/question/${q._id}?contestId=${id}`)}
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
    </>
  );
};

export default ContestQuestionsPage;