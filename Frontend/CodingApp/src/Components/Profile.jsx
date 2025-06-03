import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust path if needed
import Footer from "./Footer";

const Profile = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    oldPassword: "",
    newPassword: "",
  });
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.id}/contests`
        );
        setContests(response.data.contests);
      } catch (err) {
        setError("Failed to fetch contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [user.id]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
        setUserInfo(res.data);
        setUpdateData({
          name: res.data.name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          oldPassword: "",
          newPassword: "",
        });
      } catch (err) {
        setError("Failed to fetch user info");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [user.id]);

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const payload = {
        name: updateData.name,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
      };
      // Include password fields only if user is trying to change password
      if (updateData.newPassword) {
        payload.oldPassword = updateData.oldPassword;
        payload.newPassword = updateData.newPassword;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        payload
      );

      if (res.data.success) {
        setUserInfo(res.data.user);
        setUpdateSuccess("User info updated successfully!");
        setUpdateMode(false);
        // Clear passwords in form
        setUpdateData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
        }));
      } else {
        setUpdateError(res.data.message || "Update failed");
      }
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || "Failed to update user info"
      );
    }
  };

  if (loading || loadingUser) return <p className="mt-20 text-center">Loading...</p>;
  if (error) return <p className="mt-20 text-center text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
       <div className="min-h-screen bg-white pt-24 px-6 md:px-20">
      
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column - User info + buttons + update form */}
          <div className="border p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Information</h2>
            {!updateMode ? (
              <>
                <p>
                  <strong>Name:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {userInfo.phoneNumber || "N/A"}
                </p>
                <p>
                  <strong>Wallet Balance:</strong> ₹{userInfo.walletBalance || 0}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => {
                    setUpdateMode(true);
                    setUpdateError("");
                    setUpdateSuccess("");
                  }}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded"
                >
                  Update Info
                </button>

                <div className="flex flex-col gap-3 mt-8">
                  <button
                    onClick={() => navigate("/profile/addWallet")}
                    className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
                  >
                    Add Wallet
                  </button>
                  <button
                    onClick={() => navigate("/profile/withdraw")}
                    className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
                  >
                    Withdraw Money from the wallet
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
                  >
                    Back
                  </button>
                </div>
              </>
            ) : (
              // Update form
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                {updateError && (
                  <p className="text-red-600 font-semibold">{updateError}</p>
                )}
                {updateSuccess && (
                  <p className="text-green-600 font-semibold">{updateSuccess}</p>
                )}

                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateData.name}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updateData.email}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={updateData.phoneNumber}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <hr />

                <p className="text-gray-700 mb-2">
                  <em>Fill below only if you want to change password</em>
                </p>

                <div>
                  <label className="block font-medium mb-1">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={updateData.oldPassword}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={updateData.newPassword}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateMode(false)}
                    className="bg-gray-400 hover:bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right column - Contests */}
          <div className="border p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">My Contests</h2>

            {contests.length === 0 && <p>You have not registered for any contests.</p>}

            <ul className="space-y-4 max-h-[600px] overflow-y-auto">
              {contests.map((contest) => (
                <li
                  key={contest._id}
                  className="border rounded p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold">{contest.title}</h3>
                  <p className="text-gray-700 mb-2">{contest.description}</p>

                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(contest.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(contest.endTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Entry Fee:</strong> ₹{contest.entryFee}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};

export default Profile;
