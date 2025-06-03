import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useParams, useNavigate } from "react-router-dom";


const ContestQuestionsPage = () => {
  const { id} = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/qn/contest-questions/${id}`);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading questions...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Contest Questions</h1>
        {questions.length === 0 ? (
          <p className="text-gray-600">No questions found for this contest.</p>
        ) : (
          <ul className="space-y-6">
            {questions.map((q, index) => (
              <li key={q._id} className="border p-4 rounded-md bg-gray-50">
                <h2 className="text-xl font-semibold text-black mb-1">
                  Q{index + 1}: {q.title}
                </h2>
                <p className="text-gray-700">{q.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Difficulty:</strong> {q.difficulty}
                </div>
                 <div className="mt-4 text-right">
                  <button
                    onClick={() =>
                      navigate(`/question/${q._id}?contestId=${id}`)
                    }
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Solve
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
