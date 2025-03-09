import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle sending the newsletter
  const handleSend = async () => {
    if (subject.trim() === "" || description.trim() === "" || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    setIsLoading(true);

    // Create FormData for the newsletter
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("image", image);

    try {
      // Send the newsletter to the backend
      const response = await axios.post(
        "http://localhost:5000/api/newsletters",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Newsletter sent successfully:", response.data);

      // Reset form fields
      setSubject("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setShowPreview(false);

      // Show success message
      alert("Newsletter created and sent successfully!");
    } catch (error) {
      console.error(
        "Error sending newsletter:",
        error.response?.data || error.message
      );
      alert(
        "Failed to create newsletter: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the form is valid
  const isFormValid =
    subject.trim() !== "" && description.trim() !== "" && image !== null;

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
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-card">
          <h2 className="content-title">Create Newsletter</h2>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="Enter newsletter subject"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter newsletter content"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-upload">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="preview-thumbnail"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button
              className={`preview-button ${showPreview ? "active" : ""}`}
              onClick={() => setShowPreview(!showPreview)}
              disabled={!isFormValid}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              className="send-button"
              onClick={handleSend}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Sending..." : "Send Newsletter"}
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="preview-card">
            <h2 className="preview-header">Email Preview</h2>
            <div className="preview-content">
              <h3 className="preview-subject">{subject}</h3>
              <p>{description}</p>
              {imagePreview && <img src={imagePreview} alt="Email Preview" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
