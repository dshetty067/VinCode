import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate(); // 👈 Initialize navigate
   const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    

    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        login(); // update global auth state

        setMessage({ text: "Login successful!", type: "success" });

        setTimeout(() => {
          navigate("/"); // 👈 Redirect to homepage
        }, 1000); // optional delay to show success message
      } else {
        setMessage({ text: res.data.message || "Login failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32 px-6 md:px-20">
        <div className="max-w-md mx-auto bg-gray-50 p-10 rounded-2xl shadow-md">
          <h1 className="text-4xl font-extrabold text-black text-center mb-8">
            Log In to <span className="text-blue-800">VinCode</span>
          </h1>

          {message.text && (
            <div
              className={`mb-6 px-4 py-3 rounded-md text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
