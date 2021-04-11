const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashed) => {
    const user = new User({
      email: req.body.email,
      password: hashed,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User Created Successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "User Already Exists",
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let userFound;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      userFound = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        res.status(401).json({
          message: "Invalid Authentication Credentials",
        });
      }
      const token = jwt.sign(
        {
          email: userFound.email,
          userId: userFound._id,
        },
        "this-should-be-long-enough-for-security-reasons",
        { expiresIn: "1h" }
      );
      res.status(201).json({
        token: token,
        expiresIn: 3600000,
        userId: userFound._id
      });
    })
    .catch(() => {
      res.status(401).json({
        message: "Invalid Authentication Credentials",
      });
    });
});

module.exports = router;
