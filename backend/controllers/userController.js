const User = require("../models/User");


/*
========================================
GET CURRENT USER
========================================
*/

const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });

  }
};


/*
========================================
UPDATE PROFILE
========================================
*/

const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      name,
      bio,
      profileImage,
      skillsToTeach,
      skillsToLearn,
    } = req.body;


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    if (name !== undefined) {
      user.name = name;
    }


    if (bio !== undefined) {
      user.bio = bio;
    }


    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }


    if (Array.isArray(skillsToTeach)) {
      user.skillsToTeach = skillsToTeach;
    }


    if (Array.isArray(skillsToLearn)) {
      user.skillsToLearn = skillsToLearn;
    }


    const updatedUser = await user.save();


    res.status(200).json({

      message:
        "Profile updated successfully",

      user: {

        id: updatedUser._id,

        name: updatedUser.name,

        email: updatedUser.email,

        bio: updatedUser.bio,

        profileImage:
          updatedUser.profileImage,

        skillsToTeach:
          updatedUser.skillsToTeach,

        skillsToLearn:
          updatedUser.skillsToLearn,

      },

    });

  } catch (error) {

    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to update profile",

      error:
        error.message,

    });

  }
};


/*
========================================
ADD TEACHING SKILL
========================================
*/

const addTeachSkill = async (req, res) => {
  try {

    const { skill } = req.body;


    if (!skill || !skill.trim()) {

      return res.status(400).json({
        message: "Skill is required",
      });

    }


    const user =
      await User.findById(req.user.id);


    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }


    const cleanSkill =
      skill.trim();


    const exists =
      user.skillsToTeach.some(
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          cleanSkill.toLowerCase()
      );


    if (exists) {

      return res.status(400).json({
        message: "Skill already exists",
      });

    }


    user.skillsToTeach.push(
      cleanSkill
    );


    await user.save();


    res.status(200).json({

      message:
        "Teaching skill added successfully",

      skillsToTeach:
        user.skillsToTeach,

    });

  } catch (error) {

    console.error(
      "Add teaching skill error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to add teaching skill",

      error:
        error.message,

    });

  }
};


/*
========================================
ADD LEARNING SKILL
========================================
*/

const addLearnSkill = async (req, res) => {
  try {

    const { skill } = req.body;


    if (!skill || !skill.trim()) {

      return res.status(400).json({
        message: "Skill is required",
      });

    }


    const user =
      await User.findById(req.user.id);


    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }


    const cleanSkill =
      skill.trim();


    const exists =
      user.skillsToLearn.some(
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          cleanSkill.toLowerCase()
      );


    if (exists) {

      return res.status(400).json({
        message: "Skill already exists",
      });

    }


    user.skillsToLearn.push(
      cleanSkill
    );


    await user.save();


    res.status(200).json({

      message:
        "Learning skill added successfully",

      skillsToLearn:
        user.skillsToLearn,

    });

  } catch (error) {

    console.error(
      "Add learning skill error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to add learning skill",

      error:
        error.message,

    });

  }
};


/*
========================================
SEARCH USERS
========================================
*/

const searchUsers = async (req, res) => {
  try {

    const search =
      req.query.search || "";


    const users = await User.find({

      _id: {
        $ne: req.user.id,
      },

      $or: [

        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          skillsToTeach: {
            $regex: search,
            $options: "i",
          },
        },

        {
          skillsToLearn: {
            $regex: search,
            $options: "i",
          },
        },

      ],

    })
      .select("-password")
      .sort({
        createdAt: -1,
      });


    res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {

    console.error(
      "Search users error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to search users",

      error:
        error.message,

    });

  }
};


/*
========================================
GET ALL STUDENTS
========================================

GET /api/users
*/

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({

      _id: {
        $ne: req.user.id,
      },

    })
      .select("-password")
      .sort({
        createdAt: -1,
      });


    res.status(200).json({

      count: users.length,

      users,

    });

  } catch (error) {

    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to get students",

      error:
        error.message,

    });

  }
};


/*
========================================
EXPORT CONTROLLERS
========================================
*/

module.exports = {

  getMe,

  updateProfile,

  addTeachSkill,

  addLearnSkill,

  searchUsers,

  getAllUsers,

};