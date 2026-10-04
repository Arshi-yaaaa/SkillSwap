import React, { useEffect, useState } from "react";
import {
  searchStudents,
  sendExchangeRequest,
} from "../services/api";

function FindStudents() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [requestData, setRequestData] = useState({
    skillOffered: "",
    skillWanted: "",
    message: "",
  });


  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await searchStudents({
        search: search,
      });

      setStudents(response.data.users || []);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStudents();
  }, []);


  const handleSearch = async (e) => {
    e.preventDefault();

    await loadStudents();
  };


  const openRequestModal = (student) => {
    setSelectedStudent(student);

    setRequestData({
      skillOffered: "",
      skillWanted: "",
      message: "",
    });

    setMessage("");
  };


  const closeRequestModal = () => {
    setSelectedStudent(null);

    setRequestData({
      skillOffered: "",
      skillWanted: "",
      message: "",
    });
  };


  const handleRequestChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      return;
    }

    try {
      setLoading(true);

      const response = await sendExchangeRequest({
        receiverId: selectedStudent._id || selectedStudent.id,
        skillOffered: requestData.skillOffered,
        skillWanted: requestData.skillWanted,
        message: requestData.message,
      });

      setMessage(
        response.data.message ||
          "Exchange request sent successfully"
      );

      closeRequestModal();

      alert("Exchange request sent successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to send request"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="students-page">

      <div className="students-container">

        <div className="page-header">

          <div>
            <h1>Find Students</h1>

            <p>
              Find students who can teach the skills
              you want to learn.
            </p>
          </div>

        </div>


        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>

        </form>


        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {loading && (
          <p className="loading-text">
            Loading...
          </p>
        )}


        {!loading && students.length === 0 && (
          <div className="empty-state">
            <h2>No students found</h2>

            <p>
              Try searching for another name or skill.
            </p>
          </div>
        )}


        <div className="students-grid">

          {students.map((student) => (

            <div
              className="student-card"
              key={student._id || student.id}
            >

              <div className="student-avatar">

                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={student.name}
                  />
                ) : (
                  <span>
                    {student.name
                      ? student.name
                          .charAt(0)
                          .toUpperCase()
                      : "S"}
                  </span>
                )}

              </div>


              <h2>
                {student.name}
              </h2>


              <p className="student-email">
                {student.email}
              </p>


              {student.bio && (
                <p className="student-bio">
                  {student.bio}
                </p>
              )}


              <div className="skills-section">

                <h3>
                  Can Teach
                </h3>

                <div className="skills-list">

                  {(student.skillsToTeach || []).map(
                    (skill, index) => (

                      <span
                        className="skill-tag teach"
                        key={index}
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>


              <div className="skills-section">

                <h3>
                  Wants to Learn
                </h3>

                <div className="skills-list">

                  {(student.skillsToLearn || []).map(
                    (skill, index) => (

                      <span
                        className="skill-tag learn"
                        key={index}
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>


              <button
                className="request-button"
                onClick={() =>
                  openRequestModal(student)
                }
              >
                Send Exchange Request
              </button>

            </div>

          ))}

        </div>

      </div>


      {selectedStudent && (

        <div className="modal-overlay">

          <div className="request-modal">

            <button
              className="modal-close"
              onClick={closeRequestModal}
            >
              ×
            </button>


            <h2>
              Send Exchange Request
            </h2>


            <p>
              Send a skill exchange request to{" "}
              <strong>
                {selectedStudent.name}
              </strong>
            </p>


            <form
              onSubmit={handleSendRequest}
            >

              <label>
                Skill You Can Teach
              </label>

              <input
                type="text"
                name="skillOffered"
                placeholder="Example: Python"
                value={requestData.skillOffered}
                onChange={handleRequestChange}
                required
              />


              <label>
                Skill You Want to Learn
              </label>

              <input
                type="text"
                name="skillWanted"
                placeholder="Example: UI/UX Design"
                value={requestData.skillWanted}
                onChange={handleRequestChange}
                required
              />


              <label>
                Message
              </label>

              <textarea
                name="message"
                placeholder="Write a short message..."
                value={requestData.message}
                onChange={handleRequestChange}
                rows="4"
              />


              <button
                type="submit"
                className="send-request-button"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Request"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default FindStudents;