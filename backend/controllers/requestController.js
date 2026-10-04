const ExchangeRequest = require("../models/ExchangeRequest");
const User = require("../models/User");

// SEND REQUEST
exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, skillOffered, skillWanted, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver is required",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const existingRequest = await ExchangeRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending request with this student",
      });
    }

    const request = await ExchangeRequest.create({
      sender: senderId,
      receiver: receiverId,
      skillOffered: skillOffered || "",
      skillWanted: skillWanted || "",
      message: message || "",
      status: "pending",
    });

    const populatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage skillsToTeach skillsToLearn")
      .populate(
        "receiver",
        "name email profileImage skillsToTeach skillsToLearn"
      );

    res.status(201).json({
      message: "Exchange request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Send request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET RECEIVED REQUESTS
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({
      receiver: req.user.id,
    })
      .populate("sender", "name email profileImage skillsToTeach skillsToLearn")
      .populate(
        "receiver",
        "name email profileImage skillsToTeach skillsToLearn"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get received requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET SENT REQUESTS
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({
      sender: req.user.id,
    })
      .populate("sender", "name email profileImage skillsToTeach skillsToLearn")
      .populate(
        "receiver",
        "name email profileImage skillsToTeach skillsToLearn"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get sent requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ACCEPT REQUEST
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ExchangeRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to accept this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    request.status = "accepted";

    await request.save();

    const updatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage skillsToTeach skillsToLearn")
      .populate(
        "receiver",
        "name email profileImage skillsToTeach skillsToLearn"
      );

    res.status(200).json({
      message: "Request accepted",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Accept request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// REJECT REQUEST
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ExchangeRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to reject this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    request.status = "rejected";

    await request.save();

    const updatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage skillsToTeach skillsToLearn")
      .populate(
        "receiver",
        "name email profileImage skillsToTeach skillsToLearn"
      );

    res.status(200).json({
      message: "Request rejected",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Reject request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};