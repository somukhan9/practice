const User = require("../model/User");
const Token = require("../model/Token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All the fields must be filled" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Length of the password must be 6" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email has already taken" });
    }
    user = await new User({ email, password }).save();
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    res.status(201).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields must be filled",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Length of the password must be 6",
      });
    }

    let user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credential" });
    }

    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied, Token missing" });
    }

    const tokenDoc = await Token.findOne({ token: refreshToken });

    if (!tokenDoc) {
      return res.status(401).json({ success: false, message: "Token Expired" });
    }

    // extracting the refreshToken
    const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ user: payload }, ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await Token.findOneAndDelete({ token: refreshToken });
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
