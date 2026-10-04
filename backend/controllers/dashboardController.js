const User = require("../models/User");
const ExchangeRequest = require("../models/ExchangeRequest");


// ==========================================
// GET DASHBOARD
// ==========================================

const getDashboard = async (req, res) => {
    try {
        // ------------------------------------------
        // GET CURRENT USER
        // ------------------------------------------

        const user = await User.findById(req.user._id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // ------------------------------------------
        // GET ALL REQUESTS RELATED TO USER
        // ------------------------------------------

        const allRequests = await ExchangeRequest.find({
            $or: [
                {
                    sender: req.user._id
                },
                {
                    receiver: req.user._id
                }
            ]
        })
            .populate(
                "sender",
                "name email bio profileImage skillsToTeach skillsToLearn"
            )
            .populate(
                "receiver",
                "name email bio profileImage skillsToTeach skillsToLearn"
            )
            .sort({
                createdAt: -1
            });


        // ------------------------------------------
        // SENT REQUESTS
        // ------------------------------------------

        const sentRequests = allRequests.filter(
            request =>
                request.sender._id.toString() ===
                req.user._id.toString()
        );


        // ------------------------------------------
        // RECEIVED REQUESTS
        // ------------------------------------------

        const receivedRequests = allRequests.filter(
            request =>
                request.receiver._id.toString() ===
                req.user._id.toString()
        );


        // ------------------------------------------
        // PENDING REQUESTS
        // ------------------------------------------

        const pendingRequests = allRequests.filter(
            request =>
                request.status === "pending"
        );


        // ------------------------------------------
        // ACCEPTED REQUESTS
        // ------------------------------------------

        const acceptedRequests = allRequests.filter(
            request =>
                request.status === "accepted"
        );


        // ------------------------------------------
        // REJECTED REQUESTS
        // ------------------------------------------

        const rejectedRequests = allRequests.filter(
            request =>
                request.status === "rejected"
        );


        // ------------------------------------------
        // ACTIVE EXCHANGES
        // ------------------------------------------

        const activeExchanges = acceptedRequests;


        // ------------------------------------------
        // STATISTICS
        // ------------------------------------------

        const statistics = {
            totalRequests: allRequests.length,

            sentRequests: sentRequests.length,

            receivedRequests:
                receivedRequests.length,

            pendingRequests:
                pendingRequests.length,

            acceptedRequests:
                acceptedRequests.length,

            rejectedRequests:
                rejectedRequests.length,

            activeExchanges:
                activeExchanges.length
        };


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(200).json({

            message:
                "Dashboard data retrieved successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileImage:
                    user.profileImage,
                skillsToTeach:
                    user.skillsToTeach,
                skillsToLearn:
                    user.skillsToLearn
            },

            statistics,

            requests: {
                sent: sentRequests,
                received: receivedRequests,
                pending: pendingRequests,
                accepted: acceptedRequests,
                rejected: rejectedRequests
            },

            activeExchanges

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while loading dashboard"
        });
    }
};


module.exports = {
    getDashboard
};