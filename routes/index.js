const router = require("express").Router();
const authCtroller = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// signup user
router.post("/signup", authCtroller.signup);
// login user
router.post("/login", authCtroller.login);
// generate refresh token
router.post("/refresh_token", authCtroller.generateRefreshToken);
// logout user
router.delete("/logout", authCtroller.logout);
// protected route
router.get("/protected", authMiddleware.checkAuth, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
