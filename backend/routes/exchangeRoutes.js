const express = require("express");

const router = express.Router();

const {
  getMyExchanges,
} = require("../controllers/exchangeController");

const authMiddleware =
  require("../middleware/authMiddleware");


/*
========================================
GET MY EXCHANGES
========================================

GET /api/exchanges
*/

router.get(
  "/",
  authMiddleware,
  getMyExchanges
);


module.exports = router;