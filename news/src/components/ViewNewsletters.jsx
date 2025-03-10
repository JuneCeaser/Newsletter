import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const ViewNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/newsletters?page=${currentPage}&limit=10`
        );
        setNewsletters(response.data.newsletters);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      }
    };

    fetchNewsletters();
  }, [currentPage]);

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
      console.error("Error deleting newsletter:", error);
      alert("Failed to delete newsletter");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          <h2 className="content-title">Latest Newsletters</h2>

          <div className="newsletter-grid">
            {newsletters.length > 0 ? (
              newsletters.map((news) => (
                <div key={news._id} className="newsletter-item">
                  <h3 className="newsletter-title">{news.subject}</h3>
                  <div className="newsletter-image-container">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt="Newsletter"
                        className="newsletter-image"
                      />
                    ) : (
                      <div className="newsletter-image-placeholder">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="newsletter-description">{news.description}</p>
                  <p className="newsletter-date">
                    Created: {new Date(news.createdAt).toLocaleString()}
                  </p>
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

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNewsletters;
