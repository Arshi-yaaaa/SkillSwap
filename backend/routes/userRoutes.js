const express = require("express");

const router = express.Router();


const {
  getMe,
  updateProfile,
  addTeachSkill,
  addLearnSkill,
  searchUsers,
  getAllUsers,
} = require("../controllers/userController");


const authMiddleware =
  require("../middleware/authMiddleware");


/*
========================================
GET CURRENT USER
========================================

GET /api/users/me
*/

router.get(
  "/me",
  authMiddleware,
  getMe
);


/*
========================================
UPDATE PROFILE
========================================

PUT /api/users/profile
*/

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


/*
========================================
ADD TEACHING SKILL
========================================

POST /api/users/skills/teach
*/

router.post(
  "/skills/teach",
  authMiddleware,
  addTeachSkill
);


/*
========================================
ADD LEARNING SKILL
========================================

POST /api/users/skills/learn
*/

router.post(
  "/skills/learn",
  authMiddleware,
  addLearnSkill
);


/*
========================================
SEARCH STUDENTS
========================================

GET /api/users/search?search=Python
*/

router.get(
  "/search",
  authMiddleware,
  searchUsers
);


/*
========================================
GET ALL STUDENTS
========================================

GET /api/users
*/

router.get(
  "/",
  authMiddleware,
  getAllUsers
);


module.exports = router;