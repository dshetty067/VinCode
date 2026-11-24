import { useEffect, useState } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

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

const QuestionPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const contestId = searchParams.get("contestId");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const userId = user?.id || user?._id;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/qn/questions/${id}`)
      .then((res) => setQuestion(res.data.question))
      .catch((err) => console.error("Failed to fetch question", err));
  }, [id]);

  useEffect(() => {
    if (!contestId) return;

    axios
      .get(`http://localhost:5000/cont/contests/${contestId}`)
      .then((res) => {
        const contestEndTime = res.data?.contest?.endTime;
        if (contestEndTime) {
          setEndTime(contestEndTime);
          setTimeLeft(formatRemainingTime(contestEndTime));
        }
      })
      .catch((err) => console.error("Failed to fetch contest timer", err));
  }, [contestId]);

  useEffect(() => {
    if (!endTime) return;

    setTimeLeft(formatRemainingTime(endTime));
    const interval = setInterval(() => {
      setTimeLeft(formatRemainingTime(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit your code? You can submit a solution for this question only once."
    );
    if (!confirmed) return;

    setSubmitting(true);
    setMessage("Submitting your code...");

    try {
      await axios.post("http://localhost:5000/sub/submit-code", {
        user: userId,
        contest: contestId,
        question: id,
        code,
        language,
      });

      navigate(`/contest/${contestId}/questions`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting code.");
      setSubmitting(false);
    }
  };

  if (!question) {
    return (
      <div className="text-center mt-20 text-blue-800 font-semibold">
        Loading question...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 mb-12">
        {/* Top Right Time Left Icon Badge */}
        <div className="flex justify-end mb-3">
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

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Question Details & Notes */}
          <div className="w-full lg:w-[42%] bg-white rounded-xl p-6 sm:p-8 shadow-lg text-blue-950 border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-4 border-b pb-3 border-blue-200 text-blue-900">
              {question.title}
            </h2>
            <p className="mb-6 leading-relaxed whitespace-pre-line text-gray-800">
              {question.description}
            </p>

            {question.examples?.length > 0 && (
              <>
                <h4 className="text-lg font-semibold mb-3 border-b pb-1.5 border-blue-200 text-blue-900">
                  Examples
                </h4>
                <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700">
                  {question.examples.map((ex, i) => (
                    <li key={i}>
                      <p>
                        <strong>Input:</strong>{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                          {ex.input}
                        </code>
                      </p>
                      <p className="mt-1">
                        <strong>Output:</strong>{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                          {ex.output}
                        </code>
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="text-sm text-blue-900 font-medium pb-4 border-b border-gray-200">
              Difficulty:{" "}
              <span
                className={`font-bold capitalize ${
                  question.difficulty === "hard"
                    ? "text-red-600"
                    : question.difficulty === "medium"
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            {/* Note Section */}
            <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-2">
                Note
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 leading-relaxed">
                <li>
                  Code can be submitted only once for a question, and your
                  submissions are judged and evaluated only after you finish the
                  contest.
                </li>
                <li>
                  Test cases follow the exact same input and output format shown
                  in the examples. Please ensure your code adheres to this format for successful evaluation.
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Code Editor Workspace */}
          <div className="w-full lg:w-[58%] flex flex-col bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800">
            {/* Editor Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Language:
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={submitting}
                  className="border border-slate-600 rounded-md px-3 py-1.5 text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/contest/${contestId}/questions`}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Back
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-1.5 rounded-md text-sm font-semibold transition"
                >
                  {submitting ? "Submitting..." : "Submit Code"}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <MonacoEditor
              height="540px"
              defaultLanguage="javascript"
              language={language}
              value={code}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 14, bottom: 14 },
              }}
            />

            {message && (
              <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 text-sm font-medium text-emerald-400">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionPage;