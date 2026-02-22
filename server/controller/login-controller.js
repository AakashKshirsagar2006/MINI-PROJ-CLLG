const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user-model');
const Staff = require('../model/staff-model'); 
const { isValidEmail, isStaffID } = require('../utils/userID-validator');

const allowedUserType = ["common", "staff", "admin"];

const loginController = [
  check("userType")
    .custom((value, { req }) => {
      if (!allowedUserType.includes(value)) throw new Error("Invalid user type");
      
      if (value === "common") {
        // Fixed tiny typo: UserID to userID
        if (!isValidEmail(req.body.userID)) throw new Error("Enter a valid email");
      } else {
        // Admin or Staff validation
        if (!isStaffID(req.body.userID)) throw new Error("Enter a valid ID");
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req).array().map((err) => err.msg);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { userType, userID, password } = req.body;
    let account = null;

    //THE SPLIT LOGIC: Search the correct collection based on role
    if (userType === "staff") {
      account = await Staff.findOne({ staffId: userID });
    } else {
      // For common (students) and admin, keep using the User collection
      account = await User.findOne({ email: userID });
    }

    if (!account) {
      return res.status(400).json({ 
        errors: [`Invalid ${userType === "common" ? "email" : "ID"} or password`] 
      });
    }

    const passCheckRes = await bcrypt.compare(password, account.password);
    if (!passCheckRes) {
      return res.status(400).json({ 
        errors: [`Invalid ${userType === "common" ? "email" : "ID"} or password`] 
      });
    }

    //Attach to session and send response
    req.session.user = account;
    return res.status(200).json({ user: account });
  }
];

const autoLoginController = (req, res) => {
  const user = req.session.user;
  if (user) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({ user: null });
}

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Request cannot be fulfilled" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
}

module.exports = {
  loginController,
  autoLoginController,
  logoutController
}