import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          SkillSwap
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/dashboard" className="navbar-link">
            🏠 Dashboard
          </Link>

          <Link to="/profile" className="navbar-link">
            👤 My Profile
          </Link>

          <Link to="/students" className="navbar-link">
            👥 Find Students
          </Link>

          <Link to="/exchanges" className="navbar-link">
            🔄 Exchanges
          </Link>

          <Link to="/requests" className="navbar-link">
            📩 Requests
          </Link>

        </div>

        {/* Right side */}
        <div className="navbar-right">

          {user && (
            <span className="navbar-user">
              {user.name}
            </span>
          )}

          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;