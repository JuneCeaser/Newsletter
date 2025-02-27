import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import "../styles/Dashboard.css";

const ViewSubscribers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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

          <div className="subscriber-list">
            {users.length === 0 ? (
              <p className="no-data">No subscribers found.</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="subscriber-item">
                  <div className="subscriber-info">
                    <h3>{user.name}</h3>
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
        </div>
      </div>
    </div>
  );
};

export default ViewSubscribers;
