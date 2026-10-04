import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-background">

        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>

      </div>


      <div className="login-wrapper">


        {/* LEFT SIDE */}

        <section className="login-brand-section">

          <div className="login-brand">

            <div className="login-logo">
              SS
            </div>

            <h1>
              Skill<span>Swap</span>
            </h1>

            <p>
              Learn together. Teach together.
              Grow together.
            </p>

          </div>


          <div className="login-feature-list">

            <div className="login-feature">

              <div className="feature-icon">
                🎓
              </div>

              <div>
                <h3>
                  Share Your Skills
                </h3>

                <p>
                  Teach what you know to
                  fellow students.
                </p>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                🔍
              </div>

              <div>
                <h3>
                  Discover Students
                </h3>

                <p>
                  Find students who can
                  teach what you want to learn.
                </p>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                🤝
              </div>

              <div>
                <h3>
                  Exchange Skills
                </h3>

                <p>
                  Build meaningful skill
                  exchanges with your peers.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* LOGIN CARD */}

        <section className="login-card">

          <div className="login-card-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to SkillSwap
            </p>

          </div>


          {error && (

            <div className="login-error">

              <span className="login-error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-button-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}

            </button>

          </form>


          <div className="login-divider">
            <span>New to SkillSwap?</span>
          </div>


          <Link
            to="/register"
            className="register-link"
          >
            Create an Account
          </Link>


        </section>

      </div>


      <div className="login-footer">
        SkillSwap • Student Skill Exchange Platform
      </div>

    </main>
  );
}

export default Login;