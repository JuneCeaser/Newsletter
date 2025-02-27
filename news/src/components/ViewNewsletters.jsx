import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import "../styles/Dashboard.css";

const ViewNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/newsletters"
        );
        setNewsletters(response.data);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      }
    };

    fetchNewsletters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/newsletters/${id}`);
      alert("Newsletter deleted successfully!");
      setNewsletters((prevNewsletters) =>
        prevNewsletters.filter((newsletter) => newsletter._id !== id)
      );
    } catch (error) {
      console.error(
        "Error deleting newsletter:",
        error.response?.data || error.message
      );
      alert("Failed to delete newsletter");
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
          <h2 className="content-title">All Newsletters</h2>

          <div className="newsletter-grid">
            {newsletters.length > 0 ? (
              newsletters.map((news) => (
                <div key={news._id} className="newsletter-item">
                  <h3>{news.subject}</h3>
                  <p>{news.description}</p>
                  {news.imageUrl && (
                    <img
                      src={news.imageUrl}
                      alt="Newsletter"
                      className="newsletter-image"
                    />
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(news._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data">No newsletters available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNewsletters;
