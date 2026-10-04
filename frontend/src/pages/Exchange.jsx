import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Exchange() {

  const [exchanges, setExchanges] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    loadExchanges();

  }, []);


  const loadExchanges = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/api/exchanges"
        );


      setExchanges(
        response.data.exchanges ||
        []
      );


    } catch (err) {

      console.error(
        "Exchange loading error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to load exchanges."
      );


    } finally {

      setLoading(false);

    }

  };


  const getInitials = (name) => {

    if (!name) {
      return "S";
    }

    return name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };


  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );

  };


  if (loading) {

    return (
      <>
        <Navbar />

        <main className="exchange-page">

          <div className="exchange-container">

            <div className="exchange-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading your exchanges...
              </p>

            </div>

          </div>

        </main>
      </>
    );

  }


  return (
    <>
      <Navbar />

      <main className="exchange-page">

        <div className="exchange-container">


          {/* HEADER */}

          <div className="exchange-header">

            <h1>
              My Exchanges
            </h1>

            <p>
              Track your active skill exchanges
              with other students.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="exchange-error">

              {error}

            </div>

          )}


          {/* EMPTY */}

          {!error &&
            exchanges.length === 0 && (

              <div className="exchange-empty">

                <div className="exchange-empty-icon">
                  🤝
                </div>

                <h2>
                  No active exchanges
                </h2>

                <p>
                  Once another student accepts
                  your skill exchange request,
                  it will appear here.
                </p>

              </div>

            )}


          {/* EXCHANGES */}

          {exchanges.length > 0 && (

            <div className="exchange-grid">

              {exchanges.map(
                (exchange) => {

                  const student =
                    exchange.sender?._id ===
                    exchange.receiver?._id
                      ? exchange.sender
                      : exchange.sender;


                  return (

                    <div
                      className="exchange-card"
                      key={exchange._id}
                    >

                      <div className="exchange-card-top">


                        <div className="exchange-person">

                          <div className="exchange-avatar">

                            {student?.profileImage ? (

                              <img
                                src={
                                  student.profileImage
                                }
                                alt={
                                  student.name
                                }
                              />

                            ) : (

                              getInitials(
                                student?.name
                              )

                            )}

                          </div>


                          <div>

                            <h3>
                              {student?.name ||
                                "Student"}
                            </h3>

                            <p>
                              {student?.email ||
                                "SkillSwap Student"}
                            </p>

                          </div>

                        </div>


                        <span className="exchange-active">
                          Active
                        </span>

                      </div>


                      <div className="exchange-skills">


                        <div className="exchange-skill-box">

                          <span>
                            Skill Offered
                          </span>

                          <strong>
                            {exchange.skillOffered ||
                              "Not specified"}
                          </strong>

                        </div>


                        <div className="exchange-middle">
                          ⇄
                        </div>


                        <div className="exchange-skill-box">

                          <span>
                            Skill Wanted
                          </span>

                          <strong>
                            {exchange.skillWanted ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>


                      {exchange.message && (

                        <div className="exchange-message">

                          <span>
                            Message
                          </span>

                          <p>
                            {exchange.message}
                          </p>

                        </div>

                      )}


                      <div className="exchange-date">

                        Accepted{" "}
                        {formatDate(
                          exchange.updatedAt
                        )}

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </main>
    </>
  );

}

export default Exchange;