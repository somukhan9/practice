const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env;

exports.checkAuth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied, Token missing" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = payload.user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session timed out. Please login again",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. Please login again" });
    }
    console.error(error);
    res.status(400).json({ success: false, message: error });
  }
};
