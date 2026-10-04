import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  useAuth,
} from "../context/AuthContext";

import api from "../services/api";


function Profile() {

  const {
    user,
    updateUser,
  } = useAuth();


  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [skillsToTeach, setSkillsToTeach] =
    useState([]);

  const [skillsToLearn, setSkillsToLearn] =
    useState([]);


  const [teachInput, setTeachInput] =
    useState("");

  const [learnInput, setLearnInput] =
    useState("");


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  /*
  ========================================
  LOAD PROFILE
  ========================================
  */

  useEffect(() => {

    loadProfile();

  }, []);


  const loadProfile = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/api/users/me"
        );


      const profile =
        response.data.user ||
        response.data;


      setName(
        profile.name || ""
      );

      setBio(
        profile.bio || ""
      );

      setSkillsToTeach(
        Array.isArray(profile.skillsToTeach)
          ? profile.skillsToTeach
          : []
      );

      setSkillsToLearn(
        Array.isArray(profile.skillsToLearn)
          ? profile.skillsToLearn
          : []
      );


      /*
      ========================================
      UPDATE GLOBAL AUTH USER
      ========================================
      */

      if (updateUser) {

        updateUser(profile);

      }

    } catch (err) {

      console.error(
        "Profile loading error:",
        err
      );


      /*
      ========================================
      FALLBACK
      ========================================
      */

      if (user) {

        setName(
          user.name || ""
        );

        setBio(
          user.bio || ""
        );

        setSkillsToTeach(
          Array.isArray(user.skillsToTeach)
            ? user.skillsToTeach
            : []
        );

        setSkillsToLearn(
          Array.isArray(user.skillsToLearn)
            ? user.skillsToLearn
            : []
        );

      }

    } finally {

      setLoading(false);

    }

  };


  /*
  ========================================
  ADD TEACHING SKILL
  ========================================
  */

  const addTeachingSkill = () => {

    const skill =
      teachInput.trim();


    if (!skill) {

      return;

    }


    const alreadyExists =
      skillsToTeach.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );


    if (alreadyExists) {

      setTeachInput("");

      return;

    }


    setSkillsToTeach(
      [
        ...skillsToTeach,
        skill,
      ]
    );

    setTeachInput("");

  };


  /*
  ========================================
  ADD LEARNING SKILL
  ========================================
  */

  const addLearningSkill = () => {

    const skill =
      learnInput.trim();


    if (!skill) {

      return;

    }


    const alreadyExists =
      skillsToLearn.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );


    if (alreadyExists) {

      setLearnInput("");

      return;

    }


    setSkillsToLearn(
      [
        ...skillsToLearn,
        skill,
      ]
    );

    setLearnInput("");

  };


  /*
  ========================================
  REMOVE TEACHING SKILL
  ========================================
  */

  const removeTeachingSkill = (
    index
  ) => {

    setSkillsToTeach(
      skillsToTeach.filter(
        (_, skillIndex) =>
          skillIndex !== index
      )
    );

  };


  /*
  ========================================
  REMOVE LEARNING SKILL
  ========================================
  */

  const removeLearningSkill = (
    index
  ) => {

    setSkillsToLearn(
      skillsToLearn.filter(
        (_, skillIndex) =>
          skillIndex !== index
      )
    );

  };


  /*
  ========================================
  TEACHING SKILL ENTER
  ========================================
  */

  const handleTeachKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      addTeachingSkill();

    }

  };


  /*
  ========================================
  LEARNING SKILL ENTER
  ========================================
  */

  const handleLearnKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      addLearningSkill();

    }

  };


  /*
  ========================================
  SAVE PROFILE
  ========================================
  */

  const handleSave = async (
    event
  ) => {

    event.preventDefault();


    setMessage("");

    setError("");

    setSaving(true);


    try {

      const response =
        await api.put(
          "/api/users/profile",
          {
            name,
            bio,
            skillsToTeach,
            skillsToLearn,
          }
        );


      /*
      ========================================
      GET UPDATED USER
      ========================================
      */

      const updatedUser =
        response.data.user;


      if (!updatedUser) {

        throw new Error(
          "Updated user was not returned by server."
        );

      }


      /*
      ========================================
      UPDATE PROFILE PAGE
      ========================================
      */

      setName(
        updatedUser.name || ""
      );

      setBio(
        updatedUser.bio || ""
      );

      setSkillsToTeach(
        Array.isArray(
          updatedUser.skillsToTeach
        )
          ? updatedUser.skillsToTeach
          : []
      );

      setSkillsToLearn(
        Array.isArray(
          updatedUser.skillsToLearn
        )
          ? updatedUser.skillsToLearn
          : []
      );


      /*
      ========================================
      IMPORTANT
      UPDATE AUTH CONTEXT
      ========================================

      This makes Dashboard update
      immediately without refreshing.
      */

      if (updateUser) {

        updateUser(
          updatedUser
        );

      }


      setMessage(
        "Profile updated successfully!"
      );


    } catch (err) {

      console.error(
        "Profile update error:",
        err
      );


      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {

    return (

      <>

        <Navbar />

        <div className="loading-screen">

          Loading profile...

        </div>

      </>

    );

  }


  /*
  ========================================
  PROFILE UI
  ========================================
  */

  return (

    <>

      <Navbar />


      <main className="profile-page">

        <div className="profile-container">


          {/* =================================
              HEADER
          ================================= */}

          <div className="profile-header">

            <h1>
              My Profile
            </h1>

            <p>
              Manage your profile and the
              skills you want to exchange
              with other students.
            </p>

          </div>


          {/* =================================
              SUCCESS MESSAGE
          ================================= */}

          {message && (

            <div className="profile-success">

              <span>
                ✓
              </span>

              {message}

            </div>

          )}


          {/* =================================
              ERROR MESSAGE
          ================================= */}

          {error && (

            <div className="profile-error">

              <span>
                ✕
              </span>

              {error}

            </div>

          )}


          <form
            onSubmit={handleSave}
          >


            {/* =================================
                BASIC INFORMATION
            ================================= */}

            <section className="profile-card">


              <div className="profile-card-title">

                <div className="profile-card-icon">

                  👤

                </div>


                <div>

                  <h2>
                    Basic Information
                  </h2>

                  <p>
                    Tell other students a
                    little about yourself.
                  </p>

                </div>

              </div>


              <div className="profile-form-grid">


                {/* NAME */}

                <div className="profile-form-group">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />

                </div>


                {/* EMAIL */}

                <div className="profile-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      user?.email || ""
                    }
                    disabled
                  />

                  <small>
                    Email cannot be changed.
                  </small>

                </div>

              </div>


              {/* BIO */}

              <div className="profile-form-group">

                <label>
                  Bio
                </label>

                <textarea
                  value={bio}
                  onChange={(event) =>
                    setBio(
                      event.target.value
                    )
                  }
                  placeholder="Tell other students about yourself..."
                  rows="5"
                />

              </div>


            </section>


            {/* =================================
                TEACHING SKILLS
            ================================= */}

            <section className="profile-card">


              <div className="profile-card-title">

                <div className="profile-card-icon teach">

                  🎓

                </div>


                <div>

                  <h2>
                    Skills I Can Teach
                  </h2>

                  <p>
                    Add skills that you are
                    confident enough to teach
                    other students.
                  </p>

                </div>

              </div>


              <div className="skill-input-row">

                <input
                  type="text"
                  value={teachInput}
                  onChange={(event) =>
                    setTeachInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleTeachKeyDown
                  }
                  placeholder="Example: Java, Photoshop, Python..."
                />


                <button
                  type="button"
                  onClick={
                    addTeachingSkill
                  }
                  className="add-skill-button"
                >

                  + Add Skill

                </button>

              </div>


              <div className="profile-skill-list">

                {skillsToTeach.length > 0 ? (

                  skillsToTeach.map(
                    (skill, index) => (

                      <div
                        className="
                          profile-skill-tag
                          teach
                        "
                        key={`${skill}-${index}`}
                      >

                        <span>
                          {skill}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            removeTeachingSkill(
                              index
                            )
                          }
                        >

                          ×

                        </button>

                      </div>

                    )
                  )

                ) : (

                  <p className="no-profile-skills">

                    No teaching skills
                    added yet.

                  </p>

                )}

              </div>


            </section>


            {/* =================================
                LEARNING SKILLS
            ================================= */}

            <section className="profile-card">


              <div className="profile-card-title">

                <div className="profile-card-icon learn">

                  📚

                </div>


                <div>

                  <h2>
                    Skills I Want to Learn
                  </h2>

                  <p>
                    Add skills you would like
                    to learn from other students.
                  </p>

                </div>

              </div>


              <div className="skill-input-row">

                <input
                  type="text"
                  value={learnInput}
                  onChange={(event) =>
                    setLearnInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleLearnKeyDown
                  }
                  placeholder="Example: React, UI/UX, Machine Learning..."
                />


                <button
                  type="button"
                  onClick={
                    addLearningSkill
                  }
                  className="add-skill-button"
                >

                  + Add Skill

                </button>

              </div>


              <div className="profile-skill-list">

                {skillsToLearn.length > 0 ? (

                  skillsToLearn.map(
                    (skill, index) => (

                      <div
                        className="
                          profile-skill-tag
                          learn
                        "
                        key={`${skill}-${index}`}
                      >

                        <span>
                          {skill}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            removeLearningSkill(
                              index
                            )
                          }
                        >

                          ×

                        </button>

                      </div>

                    )
                  )

                ) : (

                  <p className="no-profile-skills">

                    No learning skills
                    added yet.

                  </p>

                )}

              </div>


            </section>


            {/* =================================
                SAVE BUTTON
            ================================= */}

            <div className="profile-save-area">

              <button
                type="submit"
                className="save-profile-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Profile"}

              </button>

            </div>


          </form>


        </div>

      </main>

    </>

  );

}


export default Profile;