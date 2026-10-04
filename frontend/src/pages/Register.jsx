import React, { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import "./Register.css";


function Register() {

  const navigate =
    useNavigate();

  const {
    register
  } = useAuth();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
  ========================================
  REGISTER
  ========================================
  */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {

      setError(
        "Please fill in all fields."
      );

      return;

    }


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    try {

      setLoading(true);


      /*
      ----------------------------------------
      CALL AUTH CONTEXT REGISTER
      ----------------------------------------
      */

      await register(
        name.trim(),
        email.trim(),
        password
      );


      /*
      ----------------------------------------
      GO TO DASHBOARD
      ----------------------------------------
      */

      navigate(
        "/dashboard"
      );

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="register-page">

      <div className="register-background">

        <div
          className="
            register-glow
            register-glow-one
          "
        />

        <div
          className="
            register-glow
            register-glow-two
          "
        />

      </div>


      <div className="register-wrapper">


        {/* =================================
            LEFT SIDE
        ================================= */}

        <section className="register-brand-section">

          <div className="register-brand">

            <div className="register-logo">
              SS
            </div>

            <h1>
              Skill<span>Swap</span>
            </h1>

            <p>
              Connect with students.
              Exchange skills.
              Grow together.
            </p>

          </div>


          <div className="register-benefits">


            <div className="register-benefit">

              <div className="register-benefit-icon">
                🎯
              </div>

              <div>

                <h3>
                  Build Your Skill Profile
                </h3>

                <p>
                  Share what you can teach
                  and what you want to learn.
                </p>

              </div>

            </div>


            <div className="register-benefit">

              <div className="register-benefit-icon">
                👥
              </div>

              <div>

                <h3>
                  Connect With Students
                </h3>

                <p>
                  Find students with
                  complementary skills.
                </p>

              </div>

            </div>


            <div className="register-benefit">

              <div className="register-benefit-icon">
                🚀
              </div>

              <div>

                <h3>
                  Learn & Grow
                </h3>

                <p>
                  Exchange knowledge
                  and develop new skills.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <section className="register-card">


          <div className="register-card-header">

            <h2>
              Create Account
            </h2>

            <p>
              Join SkillSwap and start
              exchanging skills.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="register-error">

              <span className="register-error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >


            {/* NAME */}

            <div className="register-form-group">

              <label>
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your full name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-form-group">

              <label>
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="register-form-group">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Create a password"
                />

              </div>

              <small className="register-hint">
                Minimum 6 characters
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label>
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔐
                </span>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm your password"
                />

              </div>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          <div className="register-divider">

            <span>
              Already have an account?
            </span>

          </div>


          <Link
            to="/login"
            className="login-link"
          >
            Sign In
          </Link>


        </section>

      </div>


      <div className="register-footer">

        SkillSwap • Student Skill Exchange Platform

      </div>

    </main>

  );

}


export default Register;