import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
    } catch (error) {
      console.error(
        "Error sending newsletter:",
        error.response?.data || error.message
      );
    }
  };

  const isFormValid =
    subject.trim() !== "" && description.trim() !== "" && image !== null;

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Newsletter</h2>

        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Create Newsletters
          </button>
          <button
            className="nav-button"
            onClick={() => navigate("/viewSubscribers")}
          >
            View Subscribers
          </button>
          <button
            className="nav-button"
            onClick={() => navigate("/view-newsletters")}
          >
            View Newsletters
          </button>
        </div>

        <input
          type="text"
          placeholder="Subject"
          className="input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="imageUpload">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          className="sendButton"
          onClick={handleSend}
          disabled={!isFormValid}
        >
          Send
        </button>

        <button onClick={handleLogout} className="logoutButton">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
