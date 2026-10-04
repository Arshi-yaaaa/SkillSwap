const ExchangeRequest =
  require("../models/ExchangeRequest");


/*
========================================
GET MY EXCHANGES
========================================

GET /api/exchanges
*/

const getMyExchanges = async (req, res) => {

  try {

    const userId =
      req.user.id;


    const exchanges =
      await ExchangeRequest.find({

        $or: [
          {
            sender: userId,
          },
          {
            receiver: userId,
          },
        ],

        status: "accepted",

      })
        .populate(
          "sender",
          "name email profileImage skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name email profileImage skillsToTeach skillsToLearn"
        )
        .sort({
          updatedAt: -1,
        });


    res.status(200).json({

      count:
        exchanges.length,

      exchanges,

    });

  } catch (error) {

    console.error(
      "Get exchanges error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to get exchanges",

      error:
        error.message,

    });

  }

};


module.exports = {
  getMyExchanges,
};