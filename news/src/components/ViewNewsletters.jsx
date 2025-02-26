import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewNewsletters.css";

const ViewNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/newsletters");
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
      console.error("Error deleting newsletter:", error.response?.data || error.message);
      alert("Failed to delete newsletter");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">View Newsletters</h2>

        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Create Newsletter
          </button>
          <button className="nav-button">View Subscribers</button>
          <button className="nav-button" onClick={() => navigate("/view-newsletters")}>
            View Newsletters
          </button>
        </div>

        <div className="newsletter-list">
          {newsletters.length > 0 ? (
            newsletters.map((news) => (
              <div key={news._id} className="newsletter-card">
                <h3>{news.subject}</h3>
                <p>{news.description}</p>
                {news.imageUrl && (
                  <img src={`http://localhost:5000${news.imageUrl}`} alt="Newsletter" className="newsletter-image" />
                )}
                <button onClick={() => handleDelete(news._id)}>Delete</button>
               
              </div>
            ))
          ) : (
            <p>No newsletters available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNewsletters;