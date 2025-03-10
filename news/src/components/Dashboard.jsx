import React, { useState, useRef } from "react";
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
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSend = async () => {
    if (subject.trim() === "" || description.trim() === "" || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("image", image);

    try {
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

      setSubject("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setShowPreview(false);

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
            <div
              className={`drag-drop-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {imagePreview ? (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="preview-thumbnail"
                  />
                  <div className="image-name">{image.name}</div>
                </div>
              ) : (
                <div className="drop-message">
                  <i className="upload-icon">📁</i>
                  <p>Drag and drop an image here or click to select</p>
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
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
