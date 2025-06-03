import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const TopParticipants = () => {
  const { contestId } = useParams();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopParticipants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/judge/top-participants/${contestId}`);
        if (response.data.success) {
          setWinners(response.data.topParticipants);
        } else {
          setError("Failed to fetch top participants.");
        }
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopParticipants();
  }, [contestId]);

  if (loading) return <p style={{ paddingTop: "100px", textAlign: "center" }}>Loading top participants...</p>;
  if (error) return <p style={{ paddingTop: "100px", textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white  px-6 md:px-20">
      <div style={{ marginTop: "100px", display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
        <h2 style={{ marginBottom: "20px" }}>Top 3 Winners</h2>
        <table style={{ width: "100%", maxWidth: "800px", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Rank</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Questions Solved</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Reward (₹)</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={winner.userId} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{index + 1}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{winner.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{winner.email}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{winner.solvedCount}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{winner.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link
          to="/completedContest"
          className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
          style={{ textDecoration: "none" }}
        >
          Back
        </Link>
      </div>
      </div>
      <Footer/>
    </>
  );
};

export default TopParticipants;
