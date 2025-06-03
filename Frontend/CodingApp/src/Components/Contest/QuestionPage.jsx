import { useEffect, useState } from 'react';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const { id } = useParams(); // assume URL like /question/:id
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // or your default
  const [message, setMessage] = useState('');
  const contestId = searchParams.get("contestId");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`http://localhost:5000/qn/questions/${id}`)
      .then(res => setQuestion(res.data.question))
      .catch(err => console.error('Failed to fetch question', err));
  }, [id]);

  const handleSubmit = async () => {
    
    try {
      const response = await axios.post('http://localhost:5000/sub/submit-code', {
        user: user.id,             // dynamically use logged in user id
        contest: contestId,  // Replace with actual contest ID or pass as prop/query param
        question: id,
        code,
        language
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting code.');
    }
  };

  if (!question) 
    return <div className="text-center mt-20 text-blue-800 font-semibold">Loading question...</div>;

 const handleFinishContest = async () => {
  try {
    setMessage('Processing submissions...');
    
    const response = await axios.post(
      `http://localhost:5000/judge/judge-submissions/${contestId}/${user.id}`
    );

    console.log("Judging Complete:", response.data);
    await axios.post(`http://localhost:5000/cont/mark-complete`, {
      contestId,
      userId: user.id,
    });
    setMessage('Code submitted successfully. Redirecting to homepage...');
    


    // Wait 2 seconds before redirecting
    setTimeout(() => {
      navigate('/');
    }, 2000);
  } catch (err) {
    console.error("Error finishing contest:", err);
    setMessage('Failed to finish contest.');
  }
};

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 mt-24 mb-12 flex flex-col md:flex-row gap-8">
        {/* Left: Question */}
        <div className="md:w-1/2 bg-white rounded-xl p-8 shadow-lg text-blue-900">
          <h2 className="text-3xl font-extrabold mb-4 border-b pb-2 border-blue-300">
            {question.title}
          </h2>
          <p className="mb-6 leading-relaxed whitespace-pre-line">{question.description}</p>

          {question.examples?.length > 0 && (
            <>
              <h4 className="text-xl font-semibold mb-3 border-b pb-1 border-blue-300">Examples:</h4>
              <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700">
                {question.examples.map((ex, i) => (
                  <li key={i}>
                    <p><strong>Input:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{ex.input}</code></p>
                    <p><strong>Output:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{ex.output}</code></p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="text-sm text-blue-700 font-medium">
            Difficulty: <span className={`font-bold ${question.difficulty === 'Hard' ? 'text-red-600' : question.difficulty === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{question.difficulty}</span>
          </div>
        </div>

        {/* Right: Monaco Editor */}
        <div className="md:w-1/2 flex flex-col">
          <MonacoEditor
            height="450px"
            defaultLanguage="javascript"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            theme="vs-dark"
          />
          <div className="mt-4 flex justify-between items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-3 py-1 bg-white text-black"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              {/* Add more as needed */}
            </select>
            <button
              onClick={handleSubmit}
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Code
            </button>
          <Link to={`/contest/${contestId}/questions`} className='bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition'>Back</Link>
          </div>
           <button
            onClick={handleFinishContest}
            className="mt-5 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Finish Contest
          </button>
          {message && (
            <p className="mt-3 text-green-600 font-semibold">{message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionPage;
