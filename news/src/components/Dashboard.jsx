import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // State variables for managing form inputs and user authentication
  const [user, setUser] = useState(null); // Stores the authenticated user's data
  const [subject, setSubject] = useState(""); // Stores the newsletter subject
  const [description, setDescription] = useState(""); // Stores the newsletter description
  const [image, setImage] = useState(null); // Stores the uploaded image file
  const [imagePreview, setImagePreview] = useState(null); // Stores the preview of the uploaded image
  const [showPreview, setShowPreview] = useState(false); // Controls the visibility of the preview section
  const [previewMode, setPreviewMode] = useState("side"); // Toggles between 'side' and 'overlay' preview modes

  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      navigate("/login"); // Redirect to login page if token is missing
      return;
    }

    // Fetch user data from the backend
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });
        setUser(response.data.user); // Store user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token"); // Clear invalid token
        navigate("/login"); // Redirect to login page
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout function: Clears token and redirects to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handles image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Creates a URL for previewing the image
  };

  // Handles newsletter submission
  const handleSend = async () => {
    // Validate that all fields are filled
    if (subject.trim() === "" || description.trim() === "" || !image) {
      console.log("Form is incomplete, send disabled.");
      return;
    }

    const customId = uuidv4(); // Generate a unique ID for the newsletter
    const formData = new FormData(); // Create FormData object for file upload
    formData.append("id", customId);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/newsletters",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );
      console.log("Newsletter sent successfully:", response.data);

      // Reset form fields after submission
      setSubject("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setShowPreview(false);
    } catch (error) {
      console.error(
        "Error sending newsletter:",
        error.response?.data || error.message
      );
    }
  };

  // Toggles between 'side' and 'overlay' preview modes
  const togglePreviewMode = () => {
    setPreviewMode(previewMode === "side" ? "overlay" : "side");
  };

  // Check if form is valid for enabling buttons
  const isFormValid =
    subject.trim() !== "" && description.trim() !== "" && image !== null;

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
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

      {/* Main content area */}
      <div
        className={`main-content ${
          showPreview && previewMode === "side" ? "with-preview" : ""
        }`}
      >
        <div className="content-card">
          <h2 className="content-title">Create Newsletter</h2>

          {/* Subject input */}
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

          {/* Description input */}
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

          {/* Image upload */}
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

          {/* Action buttons */}
          <div className="action-buttons">
            <button
              className={`preview-button ${showPreview ? "active" : ""}`}
              onClick={() => setShowPreview(!showPreview)}
              disabled={!isFormValid}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            {showPreview && (
              <button
                className="preview-mode-button"
                onClick={togglePreviewMode}
              >
                {previewMode === "side"
                  ? "Switch to Overlay"
                  : "Switch to Side-by-Side"}
              </button>
            )}

            <button
              className="send-button"
              onClick={handleSend}
              disabled={!isFormValid}
            >
              Send Newsletter
            </button>
          </div>
        </div>

        {/* Side-by-side Preview */}
        {showPreview && previewMode === "side" && (
          <div className="preview-card side-preview">
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
