import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const ViewNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchNewsletters = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/newsletters"
        );
        setNewsletters(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setError("Failed to load newsletters. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this newsletter?")) {
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

          {isLoading ? (
            <div className="loading">Loading newsletters...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="newsletter-grid">
              {newsletters.length > 0 ? (
                newsletters.map((news) => (
                  <div key={news._id} className="newsletter-item">
                    <div className="newsletter-header">
                      <h3>{news.subject}</h3>
                      <span className="newsletter-date">
                        {formatDate(news.createdAt)}
                      </span>
                    </div>
                    <p className="newsletter-description">{news.description}</p>
                    {news.imageUrl && (
                      <div className="newsletter-image-container">
                        <img
                          src={news.imageUrl}
                          alt="Newsletter"
                          className="newsletter-image"
                        />
                      </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNewsletters;
