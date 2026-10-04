const jwt = require("jsonwebtoken");


const authMiddleware = async (req, res, next) => {

  try {

    /*
    ========================================
    GET AUTHORIZATION HEADER
    ========================================
    */

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        message: "Not authorized. Please login.",
      });

    }


    /*
    ========================================
    GET TOKEN
    ========================================
    */

    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({
        message: "Not authorized. Please login.",
      });

    }


    /*
    ========================================
    VERIFY TOKEN
    ========================================
    */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    /*
    ========================================
    STORE USER ID IN REQUEST
    ========================================
    */

    req.user = {
      id: decoded.id || decoded.userId,
    };


    /*
    ========================================
    CONTINUE
    ========================================
    */

    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error
    );


    return res.status(401).json({
      message: "Not authorized. Please login.",
    });

  }
};


module.exports = authMiddleware;