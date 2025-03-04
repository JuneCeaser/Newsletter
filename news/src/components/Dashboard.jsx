import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState("side");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSend = async () => {
    if (subject.trim() === "" || description.trim() === "" || !image) {
      console.log("Form is incomplete, send disabled.");
      return;
    }

    const customId = uuidv4();
    const formData = new FormData();
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Newsletter sent successfully:", response.data);

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

  const togglePreviewMode = () => {
    setPreviewMode(previewMode === "side" ? "overlay" : "side");
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
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div
        className={`main-content ${
          showPreview && previewMode === "side" ? "with-preview" : ""
        }`}
      >
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
