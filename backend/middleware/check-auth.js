const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    req.userData = tokenData;
    next();
  } catch (error) {
    res.status(401).json({
      message: "You Are Not Authenticated",
    });
  }
};
