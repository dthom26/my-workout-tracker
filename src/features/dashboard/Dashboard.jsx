import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        {/* <h1 className="dashboard-title">Workout Tracker</h1> */}
        <button className="btn-sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* Welcome Section */}
      {/* <div className="welcome-section">
        <h2>Welcome!</h2>
      </div> */}

      {/* Navigation Cards */}
      <div className="nav-cards">
        <div
          className="nav-card create-program-card"
          onClick={() => navigate("/CreateProgram")}
        >
          {/* <div className="card-icon">💪</div> */}
          <h3>Create New Program</h3>
          <p>Build a custom workout program tailored to your goals</p>
          <div className="card-action">Get Started →</div>
        </div>

        <div
          className="nav-card view-programs-card"
          onClick={() => navigate("/ListOfUsersPrograms")}
        >
          {/* <div className="card-icon">📋</div> */}
          <h3>My Programs</h3>
          <p>View and manage your existing workout programs</p>
          <div className="card-action">View Programs →</div>
        </div>
      </div>

      {/* Quick Stats Section (placeholder for future) */}
      <div className="quick-stats">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label"></span>
            <span className="stat-value">-</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"></span>
            <span className="stat-value">-</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"></span>
            <span className="stat-value">-</span>
          </div>
        </div>
        <p className="stats-note">🚀 Stats coming soon in future updates!</p>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>Thanks for testing my workout tracker! 💪</p>
      </div>
    </div>
  );
};

export default Dashboard;
