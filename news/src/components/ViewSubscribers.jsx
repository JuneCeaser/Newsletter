import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const ViewSubscribers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load subscribers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert("Subscriber deleted successfully!");
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete subscriber");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Newsletter App</h1>
        </div>
        <div className="sidebar-menu">
          <button
            className={`sidebar-button ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Create Newsletter
          </button>
          <button
            className={`sidebar-button ${
              location.pathname === "/viewSubscribers" ? "active" : ""
            }`}
            onClick={() => navigate("/viewSubscribers")}
          >
            View Subscribers
          </button>
          <button
            className={`sidebar-button ${
              location.pathname === "/view-newsletters" ? "active" : ""
            }`}
            onClick={() => navigate("/view-newsletters")}
          >
            View Newsletters
          </button>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-card">
          <h2 className="content-title">All Subscribers</h2>

          {isLoading ? (
            <div className="loading">Loading subscribers...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="subscriber-list">
              {users.length === 0 ? (
                <p className="no-data">No subscribers found.</p>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="subscriber-item">
                    <div className="subscriber-info">
                      <h3>{user.username}</h3>
                      <p>{user.email}</p>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubscribers;
