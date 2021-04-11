const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, "this-should-be-long-enough-for-security-reasons");
    req.userData = tokenData;
    next();
  } catch (error) {
    res.status(401).json({
      message: "You Are Not Authenticated",
    });
  }
};
