import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ViewSubscribers.css";

const ViewSubscribers = () => {
  const navigate = useNavigate();
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

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">View Subscribers</h2>

        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Create Newsletter
          </button>
          <button className="nav-button">View Subscribers</button>
          <button
            className="nav-button"
            onClick={() => navigate("/view-newsletters")}
          >
            View Newsletters
          </button>
        </div>

        <div className="subscriber-list">
          {users.length === 0 ? (
            <p>No subscribers found.</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="subscriber-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubscribers;
