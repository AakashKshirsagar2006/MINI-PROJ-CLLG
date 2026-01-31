const express = require('express');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const User = require('../model/user-model')
const {isGmail, isStaffID} = require('../utils/userID-validator')

const allowedUserType = ["common", "staff", "admin"];

const loginController = [
  check("userType")
    .custom((value, { req }) => {
      if (!allowedUserType.includes(value)) throw new Error("Invalid user type");
      else {
        if (value === "common") {
          console.log(!isGmail(req.body.UserID))
          if (!isGmail(req.body.userID)) throw new Error("Enter a valid email")

        }
        else if (!isStaffID(req.body.userID)) throw new Error("Enter a valid staff ID")
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req).array().map((err) => { return err.msg });
    if (errors.length > 0) {
      res.status(400).json({ errors })
      return;
    }
    const { userType, userID, password } = req.body;

    const user = await User.findOne({ email: userID });
    if (!user) {
      res.status(400).json({ errors: [`Invalid ${userType == "common" ? "email" : userType == "staff" ? "Staff ID" : "admin ID"} or password`] });
      return;
    }

    const passCheckRes = await bcrypt.compare(password, user.password);
    if (!passCheckRes) {
      res.status(400).json({ errors: [`Invalid ${userType == "common" ? "email" : userType == "staff" ? "Staff ID" : "admin ID"} or password`] });
      return;
    }

    req.session.user = user;
    res.status(200).json({ user });
  }];


const autoLoginController = (req, res) => {
  const user = req.session.user;
  if (user) {
    res.status(200).json({ user });
    return
  }
  res.status(401).json({ user: null });
}


const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Request cannot fulfilled" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Loged out successfully" });
    return;
  });
}


module.exports = {
  loginController,
  autoLoginController,
  logoutController
}