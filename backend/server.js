require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/authRoutes");

const userRoutes =
  require("./routes/userRoutes");

const requestRoutes =
  require("./routes/requestRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const exchangeRoutes =
  require("./routes/exchangeRoutes");


/*
========================================
CONNECT DATABASE
========================================
*/

connectDB();


/*
========================================
CREATE EXPRESS APP
========================================
*/

const app =
  express();


/*
========================================
MIDDLEWARE
========================================
*/

app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);


app.use(
  express.json()
);


app.use(
  express.urlencoded({
    extended: true,
  })
);


/*
========================================
TEST ROUTE
========================================
*/

app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "SkillSwap API is running",

    });

  }
);


/*
========================================
AUTH ROUTES
========================================
*/

app.use(
  "/api/auth",
  authRoutes
);


/*
========================================
USER ROUTES
========================================
*/

app.use(
  "/api/users",
  userRoutes
);


/*
========================================
REQUEST ROUTES
========================================
*/

app.use(
  "/api/requests",
  requestRoutes
);


/*
========================================
EXCHANGE ROUTES
========================================
*/

app.use(
  "/api/exchanges",
  exchangeRoutes
);


/*
========================================
DASHBOARD ROUTES
========================================
*/

app.use(
  "/api/dashboard",
  dashboardRoutes
);


/*
========================================
404
========================================
*/

app.use(
  (req, res) => {

    res.status(404).json({

      message:
        "API route not found",

    });

  }
);


/*
========================================
ERROR HANDLER
========================================
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(error);

    res.status(500).json({

      message:
        "Internal server error",

    });

  }
);


/*
========================================
START SERVER
========================================
*/

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);