import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Requests() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [activeTab, setActiveTab] = useState("received");

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const [receivedResponse, sentResponse] =
        await Promise.all([
          api.get("/api/requests/received"),
          api.get("/api/requests/sent")
        ]);

      const receivedData =
        receivedResponse.data;

      const sentData =
        sentResponse.data;

      setReceivedRequests(
        receivedData.requests ||
        receivedData.receivedRequests ||
        receivedData.received ||
        receivedData ||
        []
      );

      setSentRequests(
        sentData.requests ||
        sentData.sentRequests ||
        sentData.sent ||
        sentData ||
        []
      );

    } catch (err) {
      console.error(
        "Load requests error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load requests."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     ACCEPT / REJECT
  ========================================= */

  const handleAction = async (
    requestId,
    action
  ) => {
    try {
      setActionId(requestId);

      setError("");
      setSuccess("");

      if (action === "accept") {

        await api.put(
          `/api/requests/${requestId}/accept`
        );

      } else {

        await api.put(
          `/api/requests/${requestId}/reject`
        );

      }


      /*
       * UPDATE RECEIVED REQUEST
       * WITHOUT REFRESHING
       */

      setReceivedRequests(
        (previousRequests) =>
          previousRequests.map(
            (request) => {

              if (
                request._id === requestId
              ) {
                return {
                  ...request,
                  status:
                    action === "accept"
                      ? "accepted"
                      : "rejected"
                };
              }

              return request;
            }
          )
      );


      setSuccess(
        action === "accept"
          ? "Request accepted successfully."
          : "Request rejected successfully."
      );


    } catch (err) {

      console.error(
        "Request update error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to update request."
      );

    } finally {

      setActionId(null);

    }
  };


  /* =========================================
     USER
  ========================================= */

  const getUser = (
    request,
    received
  ) => {

    if (received) {
      return (
        request.sender ||
        request.from ||
        {}
      );
    }

    return (
      request.receiver ||
      request.to ||
      {}
    );
  };


  /* =========================================
     INITIALS
  ========================================= */

  const getInitials = (name) => {

    if (!name) {
      return "S";
    }

    return name
      .split(" ")
      .map(
        (word) => word.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };


  /* =========================================
     DATE
  ========================================= */

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    try {

      return new Date(date)
        .toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          }
        );

    } catch {
      return "";
    }
  };


  /* =========================================
     REQUEST CARD
  ========================================= */

  const renderRequest = (
    request,
    received
  ) => {

    const student =
      getUser(
        request,
        received
      );

    const status =
      request.status ||
      "pending";

    return (

      <div
        className="request-card"
        key={request._id}
      >

        {/* STUDENT */}

        <div className="request-student">

          <div className="request-avatar">

            {student.profileImage ? (

              <img
                src={student.profileImage}
                alt={student.name || "Student"}
              />

            ) : (

              getInitials(
                student.name
              )

            )}

          </div>


          <div>

            <h3>
              {student.name ||
                "Student"}
            </h3>

            <p>
              {student.email ||
                "SkillSwap Student"}
            </p>

          </div>

        </div>


        {/* CONTENT */}

        <div className="request-content">

          <div className="exchange-box">

            <div className="exchange-side">

              <span className="exchange-label">
                Skill Offered
              </span>

              <strong>
                {request.skillOffered ||
                  "Not specified"}
              </strong>

            </div>


            <div className="exchange-arrow">
              ⇄
            </div>


            <div className="exchange-side">

              <span className="exchange-label">
                Skill Wanted
              </span>

              <strong>
                {request.skillWanted ||
                  "Not specified"}
              </strong>

            </div>

          </div>


          {/* MESSAGE */}

          {request.message && (

            <div className="request-message">

              <span>
                Message
              </span>

              <p>
                {request.message}
              </p>

            </div>

          )}


          {/* FOOTER */}

          <div className="request-footer">

            <span className="request-date">

              {formatDate(
                request.createdAt
              )}

            </span>


            <span
              className={
                `request-status status-${status}`
              }
            >
              {status
                .charAt(0)
                .toUpperCase() +
                status.slice(1)}
            </span>

          </div>


          {/* ACTION BUTTONS */}

          {received &&
            status === "pending" && (

              <div className="request-actions">

                <button
                  className="reject-button"
                  disabled={
                    actionId ===
                    request._id
                  }
                  onClick={() =>
                    handleAction(
                      request._id,
                      "reject"
                    )
                  }
                >

                  {actionId ===
                  request._id
                    ? "Updating..."
                    : "Reject"}

                </button>


                <button
                  className="accept-button"
                  disabled={
                    actionId ===
                    request._id
                  }
                  onClick={() =>
                    handleAction(
                      request._id,
                      "accept"
                    )
                  }
                >

                  {actionId ===
                  request._id
                    ? "Updating..."
                    : "Accept"}

                </button>

              </div>

            )}

        </div>

      </div>

    );
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <>
        <Navbar />

        <main className="requests-page">

          <div className="requests-container">

            <div className="requests-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading requests...
              </p>

            </div>

          </div>

        </main>
      </>
    );

  }


  const currentRequests =
    activeTab === "received"
      ? receivedRequests
      : sentRequests;


  const pendingReceived =
    receivedRequests.filter(
      (request) =>
        request.status === "pending"
    ).length;


  const pendingSent =
    sentRequests.filter(
      (request) =>
        request.status === "pending"
    ).length;


  return (
    <>
      <Navbar />

      <main className="requests-page">

        <div className="requests-container">


          {/* HEADER */}

          <div className="requests-header">

            <h1>
              Requests
            </h1>

            <p>
              Manage your skill exchange
              requests.
            </p>

          </div>


          {/* SUCCESS */}

          {success && (

            <div className="request-success">

              <span className="message-icon">
                ✓
              </span>

              {success}

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="request-error">

              <span className="message-icon">
                !
              </span>

              {error}

            </div>

          )}


          {/* TABS */}

          <div className="request-tabs">

            <button
              className={
                `request-tab ${
                  activeTab === "received"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                setActiveTab(
                  "received"
                )
              }
            >

              <span className="tab-icon">
                📥
              </span>

              Received

              {pendingReceived > 0 && (

                <span className="request-count">
                  {pendingReceived}
                </span>

              )}

            </button>


            <button
              className={
                `request-tab ${
                  activeTab === "sent"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                setActiveTab(
                  "sent"
                )
              }
            >

              <span className="tab-icon">
                📤
              </span>

              Sent

              {pendingSent > 0 && (

                <span className="request-count">
                  {pendingSent}
                </span>

              )}

            </button>

          </div>


          {/* REQUESTS */}

          {currentRequests.length > 0 ? (

            <div className="requests-list">

              {currentRequests.map(
                (request) =>
                  renderRequest(
                    request,
                    activeTab === "received"
                  )
              )}

            </div>

          ) : (

            <div className="requests-empty">

              <div className="empty-request-icon">
                📭
              </div>

              <h2>
                No{" "}
                {activeTab} requests
              </h2>

              <p>

                {activeTab === "received"
                  ? "Requests from other students will appear here."
                  : "Requests you send to other students will appear here."}

              </p>

            </div>

          )}

        </div>

      </main>
    </>
  );
}

export default Requests;