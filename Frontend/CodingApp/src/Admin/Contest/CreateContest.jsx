
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const CreateContest = () => {
  const navigate = useNavigate();

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    entryFee: 0,
    maxParticipants: 10,
    startTime: "",
    endTime: "",
    bonusFromApp: 0,
    status: "upcoming",
    prizePool: 0,
  });

  const [questions, setQuestions] = useState([
    {
      title: "",
      description: "",
      examples: [{ input: "", output: "" }],
      testCases: [{ input: "", expectedOutput: "" }],
      difficulty: "easy",
    },
  ]);

  const [contestId, setContestId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle contest form changes
  const handleContestChange = (e) => {
    setContestData({
      ...contestData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle question field changes
  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index][e.target.name] = e.target.value;
    setQuestions(newQuestions);
  };

  // Handle example changes
  const handleExampleChange = (qIndex, exIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].examples[exIndex][field] = value;
    setQuestions(newQuestions);
  };

  // Handle test case changes
  const handleTestCaseChange = (qIndex, tcIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases[tcIndex][field] = value;
    setQuestions(newQuestions);
  };

  // Add a new question form ONLY
  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        title: "",
        description: "",
        examples: [{ input: "", output: "" }],
        testCases: [{ input: "", expectedOutput: "" }],
        difficulty: "easy",
      },
    ]);
  };

  // Add example
  const addExample = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].examples.push({
      input: "",
      output: "",
    });
    setQuestions(newQuestions);
  };

  // Add test case
  const addTestCase = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases.push({
      input: "",
      expectedOutput: "",
    });
    setQuestions(newQuestions);
  };

  // Remove example
  const removeExample = (qIndex, exIndex) => {
    const newQuestions = [...questions];

    if (newQuestions[qIndex].examples.length > 1) {
      newQuestions[qIndex].examples.splice(exIndex, 1);
      setQuestions(newQuestions);
    }
  };

  // Remove test case
  const removeTestCase = (qIndex, tcIndex) => {
    const newQuestions = [...questions];

    if (newQuestions[qIndex].testCases.length > 1) {
      newQuestions[qIndex].testCases.splice(tcIndex, 1);
      setQuestions(newQuestions);
    }
  };

  // Step 1: Create contest
  const createContest = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/cont/contests",
        contestData
      );

      setContestId(res.data.contest._id);
      setMessage("Contest created. Now add questions.");
    } catch (err) {
      console.error("Error creating contest:", err);
      setMessage("Error creating contest");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit all questions and redirect
  const addQuestions = async () => {
    if (!contestId) return;

    try {
      setLoading(true);
      setMessage("");

      for (const q of questions) {
        await axios.post(
          `http://localhost:5000/cont/contests/${contestId}/questions`,
          q
        );
      }

      alert("Contest Created Successfully");
      navigate("/");
    } catch (err) {
      console.error("Error adding questions:", err);
      setMessage("Error adding questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 pt-24 min-h-screen bg-white">

        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Create Contest
        </h1>

        {/* Contest Form */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow">
          {Object.entries(contestData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label
                htmlFor={key}
                className="mb-1 font-medium capitalize text-gray-700"
              >
                {key === "bonusFromApp"
                  ? "Bonus from App"
                  : key === "entryFee"
                  ? "Entry Fee"
                  : key.replace(/([A-Z])/g, " $1")}
              </label>

              <input
                id={key}
                type={
                  key.includes("Time")
                    ? "datetime-local"
                    : typeof value === "number"
                    ? "number"
                    : "text"
                }
                name={key}
                value={value}
                onChange={handleContestChange}
                placeholder={key}
                className="border p-2 rounded"
                disabled={contestId !== null}
              />
            </div>
          ))}
        </div>

        {/* Create Contest Button */}
        {!contestId && (
          <button
            onClick={createContest}
            type="button"
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? "Creating Contest..." : "Create Contest"}
          </button>
        )}

        {/* Questions Form */}
        {contestId && (
          <>
            <h2 className="text-xl font-semibold mt-6 text-blue-700">
              Add Questions
            </h2>

            {questions.map((q, i) => (
              <div
                key={i}
                className="border p-4 my-4 rounded-lg bg-white shadow"
              >
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Question {i + 1}
                </h3>

                <input
                  type="text"
                  name="title"
                  value={q.title}
                  onChange={(e) => handleQuestionChange(i, e)}
                  placeholder="Title"
                  className="w-full mb-2 border p-2 rounded"
                />

                <textarea
                  name="description"
                  value={q.description}
                  onChange={(e) => handleQuestionChange(i, e)}
                  placeholder="Description"
                  className="w-full mb-4 border p-2 rounded"
                />

                <select
                  name="difficulty"
                  value={q.difficulty}
                  onChange={(e) => handleQuestionChange(i, e)}
                  className="w-full mb-4 border p-2 rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                {/* Examples */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Examples
                  </h4>

                  {q.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Input"
                        value={ex.input}
                        onChange={(e) =>
                          handleExampleChange(
                            i,
                            exIdx,
                            "input",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        placeholder="Output"
                        value={ex.output}
                        onChange={(e) =>
                          handleExampleChange(
                            i,
                            exIdx,
                            "output",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />

                      <button
                        onClick={() => removeExample(i, exIdx)}
                        className="text-red-600 font-bold text-lg"
                        title="Remove example"
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addExample(i)}
                    className="mt-1 text-sm text-blue-600 hover:underline"
                    type="button"
                  >
                    + Add Example
                  </button>
                </div>

                {/* Test Cases */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Test Cases
                  </h4>

                  {q.testCases.map((tc, tcIdx) => (
                    <div
                      key={tcIdx}
                      className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Input"
                        value={tc.input}
                        onChange={(e) =>
                          handleTestCaseChange(
                            i,
                            tcIdx,
                            "input",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />

                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={tc.expectedOutput}
                        onChange={(e) =>
                          handleTestCaseChange(
                            i,
                            tcIdx,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />

                      <button
                        onClick={() => removeTestCase(i, tcIdx)}
                        className="text-red-600 font-bold text-lg"
                        title="Remove test case"
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addTestCase(i)}
                    className="mt-1 text-sm text-blue-600 hover:underline"
                    type="button"
                  >
                    + Add Test Case
                  </button>
                </div>
              </div>
            ))}

            {/* Add Question Button - ONLY adds a new question form */}
            <button
              onClick={addQuestion}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-800"
              type="button"
              disabled={loading}
            >
              + Add Question
            </button>

            {/* Submit Questions Button - Saves questions and redirects */}
            <button
              onClick={addQuestions}
              type="button"
              disabled={loading}
              className="mt-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 block disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Questions"}
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-blue-600 font-medium">
            {message}
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CreateContest;
