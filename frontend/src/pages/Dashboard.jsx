import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const skillsToTeach = user.skillsToTeach || [];
  const skillsToLearn = user.skillsToLearn || [];

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-container">

          {/* ================================
              WELCOME
          ================================= */}

          <section className="dashboard-welcome">
            <h1>
              Welcome, {user.name} 👋
            </h1>

            <p>
              Exchange knowledge, learn new skills, and connect with other
              students.
            </p>
          </section>


          {/* ================================
              PROFILE
          ================================= */}

          <section className="dashboard-profile-card">

            <div className="dashboard-avatar">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            <div className="dashboard-profile-info">

              <h2>{user.name}</h2>

              <p>{user.email}</p>

              {user.bio && (
                <p>{user.bio}</p>
              )}

              <Link
                to="/profile"
                className="manage-skills"
                style={{
                  display: "inline-block",
                  marginTop: "10px"
                }}
              >
                Edit Profile →
              </Link>

            </div>

          </section>


          {/* ================================
              STATISTICS
          ================================= */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                🎓
              </div>

              <div className="dashboard-stat-number">
                {skillsToTeach.length}
              </div>

              <div className="dashboard-stat-label">
                Skills I Teach
              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                📚
              </div>

              <div className="dashboard-stat-number">
                {skillsToLearn.length}
              </div>

              <div className="dashboard-stat-label">
                Skills I Want to Learn
              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                🔄
              </div>

              <div className="dashboard-stat-number">
                0
              </div>

              <div className="dashboard-stat-label">
                Active Exchanges
              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">
                📩
              </div>

              <div className="dashboard-stat-number">
                0
              </div>

              <div className="dashboard-stat-label">
                Pending Requests
              </div>

            </div>

          </section>


          {/* ================================
              MY SKILLS
          ================================= */}

          <section className="skills-section">

            <div className="skills-section-header">

              <h2>
                My Skills
              </h2>

              <Link
                to="/profile"
                className="manage-skills"
              >
                Manage Skills →
              </Link>

            </div>


            {/* ============================
                SKILLS I CAN TEACH
            ============================ */}

            <h3>
              🎓 Skills I Can Teach
            </h3>

            <div className="skills-list">

              {skillsToTeach.length > 0 ? (

                skillsToTeach.map((skill, index) => (
                  <span
                    className="skill-tag"
                    key={index}
                  >
                    {skill}
                  </span>
                ))

              ) : (

                <p style={{ color: "#6b7280" }}>
                  You haven't added any teaching skills yet.
                </p>

              )}

            </div>


            {/* ============================
                SKILLS I WANT TO LEARN
            ============================ */}

            <h3>
              📚 Skills I Want to Learn
            </h3>

            <div className="skills-list">

              {skillsToLearn.length > 0 ? (

                skillsToLearn.map((skill, index) => (
                  <span
                    className="skill-tag"
                    key={index}
                  >
                    {skill}
                  </span>
                ))

              ) : (

                <p style={{ color: "#6b7280" }}>
                  You haven't added any learning skills yet.
                </p>

              )}

            </div>

          </section>


          {/* ================================
              QUICK ACTIONS
          ================================= */}

          <section
            className="skills-section"
            style={{ marginTop: "25px" }}
          >

            <div className="skills-section-header">

              <h2>
                Quick Actions
              </h2>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px"
              }}
            >

              <Link
                to="/students"
                style={{
                  background: "#eef2ff",
                  color: "#4338ca",
                  padding: "18px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  textAlign: "center"
                }}
              >
                👥 Find Students
              </Link>


              <Link
                to="/requests"
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "18px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  textAlign: "center"
                }}
              >
                📩 View Requests
              </Link>


              <Link
                to="/exchanges"
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "18px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  textAlign: "center"
                }}
              >
                🔄 My Exchanges
              </Link>

            </div>

          </section>

        </div>
      </main>
    </>
  );
}

export default Dashboard;