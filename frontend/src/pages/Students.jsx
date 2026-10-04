import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [requestMessage, setRequestMessage] = useState("");

  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");

  const [sending, setSending] = useState(false);


  /* =========================================
     LOAD STUDENTS
  ========================================= */

  useEffect(() => {
    loadStudents();
  }, []);


  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users");

      const data =
        response.data.users ||
        response.data.students ||
        response.data ||
        [];

      setStudents(data);
      setFilteredStudents(data);

    } catch (err) {
      console.error("Students loading error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     SEARCH
  ========================================= */

  useEffect(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) => {
      const name =
        student.name?.toLowerCase() || "";

      const bio =
        student.bio?.toLowerCase() || "";

      const teach =
        (student.skillsToTeach || [])
          .join(" ")
          .toLowerCase();

      const learn =
        (student.skillsToLearn || [])
          .join(" ")
          .toLowerCase();

      return (
        name.includes(value) ||
        bio.includes(value) ||
        teach.includes(value) ||
        learn.includes(value)
      );
    });

    setFilteredStudents(filtered);

  }, [search, students]);


  /* =========================================
     INITIALS
  ========================================= */

  const getInitials = (name) => {
    if (!name) return "S";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };


  /* =========================================
     OPEN REQUEST MODAL
  ========================================= */

  const openRequestModal = (student) => {
    setSelectedStudent(student);

    setRequestMessage("");

    setSkillOffered("");

    setSkillWanted("");
  };


  /* =========================================
     CLOSE REQUEST MODAL
  ========================================= */

  const closeRequestModal = () => {
    if (sending) return;

    setSelectedStudent(null);

    setRequestMessage("");

    setSkillOffered("");

    setSkillWanted("");
  };


  /* =========================================
     SEND REQUEST
  ========================================= */

  const sendRequest = async () => {

    if (!selectedStudent) return;


    if (!skillOffered.trim()) {
      alert("Please select a skill you can teach.");
      return;
    }


    if (!skillWanted.trim()) {
      alert("Please select a skill you want to learn.");
      return;
    }


    try {

      setSending(true);

      await api.post(
        "/api/requests/send",
        {
          receiverId: selectedStudent._id,

          skillOffered:
            skillOffered.trim(),

          skillWanted:
            skillWanted.trim(),

          message:
            requestMessage.trim()
        }
      );


      alert(
        "Skill exchange request sent successfully!"
      );


      closeRequestModal();

    } catch (err) {

      console.error(
        "Send request error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to send request."
      );

    } finally {

      setSending(false);

    }
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="students-page">

          <div className="students-container">

            <div className="students-loading">

              <div className="loading-spinner"></div>

              <p>
                Finding students...
              </p>

            </div>

          </div>

        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="students-page">

        <div className="students-container">


          {/* =====================================
              HEADER
          ===================================== */}

          <div className="students-header">

            <h1>
              Find Students
            </h1>

            <p>
              Discover students who can teach you
              new skills and learn from you.
            </p>

          </div>


          {/* =====================================
              SEARCH
          ===================================== */}

          <div className="students-search">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or skill..."
            />

            <button
              type="button"
              className="search-button"
            >
              🔎 Search
            </button>

          </div>


          {/* =====================================
              ERROR
          ===================================== */}

          {error && (
            <div className="students-error">
              {error}
            </div>
          )}


          {/* =====================================
              RESULT COUNT
          ===================================== */}

          {!error && (
            <div className="students-result-count">

              {filteredStudents.length}{" "}
              {filteredStudents.length === 1
                ? "student"
                : "students"}{" "}
              found

            </div>
          )}


          {/* =====================================
              STUDENT GRID
          ===================================== */}

          {filteredStudents.length > 0 ? (

            <div className="students-grid">

              {filteredStudents.map(
                (student) => (

                  <div
                    className="student-card"
                    key={student._id}
                  >


                    {/* AVATAR */}

                    <div className="student-avatar">

                      {student.profileImage ? (

                        <img
                          src={student.profileImage}
                          alt={student.name}
                        />

                      ) : (

                        getInitials(
                          student.name
                        )

                      )}

                    </div>


                    {/* NAME */}

                    <h3>
                      {student.name ||
                        "Student"}
                    </h3>


                    {/* BIO */}

                    <p className="student-bio">

                      {student.bio ||
                        "This student hasn't added a bio yet."}

                    </p>


                    {/* TEACHING SKILLS */}

                    <div className="student-skills-title">
                      Can Teach
                    </div>

                    <div className="student-skills">

                      {student.skillsToTeach?.length > 0 ? (

                        student.skillsToTeach
                          .slice(0, 5)
                          .map(
                            (skill, index) => (

                              <span
                                className="student-skill"
                                key={index}
                              >
                                {skill}
                              </span>

                            )
                          )

                      ) : (

                        <span className="student-no-skill">
                          No skills added
                        </span>

                      )}

                    </div>


                    {/* LEARNING SKILLS */}

                    {student.skillsToLearn?.length > 0 && (

                      <>
                        <div className="student-skills-title">
                          Wants to Learn
                        </div>

                        <div className="student-skills">

                          {student.skillsToLearn
                            .slice(0, 4)
                            .map(
                              (skill, index) => (

                                <span
                                  className="student-skill learning"
                                  key={index}
                                >
                                  {skill}
                                </span>

                              )
                            )}

                        </div>
                      </>

                    )}


                    {/* REQUEST BUTTON */}

                    <button
                      className="request-button"
                      onClick={() =>
                        openRequestModal(
                          student
                        )
                      }
                    >
                      🤝 Send Exchange Request
                    </button>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="students-empty">

              <div className="students-empty-icon">
                🔎
              </div>

              <h2>
                No students found
              </h2>

              <p>
                Try searching for a different
                name or skill.
              </p>

            </div>

          )}

        </div>

      </main>


      {/* =========================================
          REQUEST MODAL
      ========================================= */}

      {selectedStudent && (

        <div
          className="request-modal-overlay"
          onClick={closeRequestModal}
        >

          <div
            className="request-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* CLOSE */}

            <button
              className="modal-close"
              onClick={closeRequestModal}
              disabled={sending}
            >
              ×
            </button>


            {/* ICON */}

            <div className="modal-icon">
              🤝
            </div>


            {/* TITLE */}

            <h2>
              Send Skill Exchange Request
            </h2>

            <p>
              Send a request to{" "}
              <strong>
                {selectedStudent.name}
              </strong>
              .
            </p>


            {/* =================================
                SKILL OFFERED
            ================================= */}

            <label>
              Skill You Can Teach
            </label>

            <select
              value={skillOffered}
              onChange={(event) =>
                setSkillOffered(
                  event.target.value
                )
              }
              className="request-select"
            >

              <option value="">
                Select a skill
              </option>

              {(selectedStudent.skillsToLearn ||
                []).map(
                (skill, index) => (

                  <option
                    value={skill}
                    key={index}
                  >
                    {skill}
                  </option>

                )
              )}

            </select>


            {/* =================================
                SKILL WANTED
            ================================= */}

            <label>
              Skill You Want to Learn
            </label>

            <select
              value={skillWanted}
              onChange={(event) =>
                setSkillWanted(
                  event.target.value
                )
              }
              className="request-select"
            >

              <option value="">
                Select a skill
              </option>

              {(selectedStudent.skillsToTeach ||
                []).map(
                (skill, index) => (

                  <option
                    value={skill}
                    key={index}
                  >
                    {skill}
                  </option>

                )
              )}

            </select>


            {/* =================================
                MESSAGE
            ================================= */}

            <label>
              Message
            </label>

            <textarea
              value={requestMessage}
              onChange={(event) =>
                setRequestMessage(
                  event.target.value
                )
              }
              placeholder="Tell them what you would like to learn and what you can teach..."
              rows="5"
            />


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="modal-actions">

              <button
                type="button"
                className="modal-cancel"
                onClick={closeRequestModal}
                disabled={sending}
              >
                Cancel
              </button>


              <button
                type="button"
                className="modal-send"
                onClick={sendRequest}
                disabled={sending}
              >

                {sending
                  ? "Sending..."
                  : "Send Request"}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default Students;