
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user-model')

const sendEmail = require('../utils/mail-sender');
const getResetPasswordResetCode = require('../utils/pass-reset-code-generator')
const { isGmail } = require('../utils/userID-validator')




const emailVerificationController = [
  check('email')
    .custom((value, { req }) => {
      if (!isGmail(value)) throw new Error("Enter a valid Gmail");
      return true;
    }),

  async (req, res) => {

    const errors = validationResult(req).array().map((err) => { return err.msg });
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }


    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ error: ["User do not exist"] });
      return;
    }
    const resetCode = getResetPasswordResetCode();
    const mainBody = "Your reset password code is \n\n\n" + resetCode;
    try {
      await sendEmail(email, "Reset Password", mainBody);
      const hashedResetCode = await bcrypt.hash(resetCode, 5);
      req.session.resetPass = {
        expiresAt: Date.now() + 10 * 60 * 1000,
        email: user.email,
        resetCode: hashedResetCode
      }
      res.status(200).json({ message: "Reset password code is sent to your email" })
    }
    catch (err) {
      res.status(500).json({ errors: ["OOPS! Some error occured. Please try later"] })
    }

  }]



const resetCodeController = [

  check('resetCode')
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be six characters long")
  ,

  async (req, res) => {
    const resetPassSession = req.session.resetPass;
    if (!resetPassSession) {
      res.status(404).json({ errors: ["Invalid request"] })
    }

    if (Date.now() > resetPassSession.expiresAt) {
      delete req.session.resetPass;
      return res.status(400).json({ error: "Session expired" });
    }

    req.session.resetPass.otpAttempts = (req.session.resetPass.otpAttempts || 0) + 1;

    if (req.session.resetPass.otpAttempts > 5) {
      delete req.session.resetPass;
      return res.status(429).json({
        errors: ["Too many invalid attempts. Please try again."]
      });
    }

    const errors = validationResult(req).array().map((err) => { return err.msg });
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const { resetCode } = req.body
    const result = await bcrypt.compare(resetCode, resetPassSession.resetCode);
    if (!result) {
      res.status(400).json({ errors: ["Invalid reset code"] });
      return;
    }
    res.status(200).json({ message: "Verified password reset code" });
  }]




const resetPasswordController = [
  check("newPassword")
    .custom((value, { req }) => {
      if (value.length < 8) throw new Error("Password should be 8 characters long")
      else if (value != req.body.confirmPassword) throw new Error("Re-Entered password should be same as password")
      else return true;
    }),

  async (req, res) => {
    console.log(req.body);
    const resetPassSession = req.session.resetPass;
    if (!resetPassSession) {
      res.status(404).json({ errors: ["Invalid attempt"] });
      return;
    }

    if (Date.now() > resetPassSession.expiresAt) {
      delete req.session.resetPass;
      return res.status(400).json({ error: ["Session expired"] });
    }

    const errors = validationResult(req).array().map((err) => { return err.msg });
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const { newPassword } = req.body;
    const email = resetPassSession.email;
    const changedPassword = await bcrypt.hash(newPassword, 12);
    const dbRes = await User.updateOne({ email: email }, { $set: { password: changedPassword } });
    delete req.session.resetPass;
    res.status(200).json({ message: "Password updated" })
  }];


module.exports = {
  emailVerificationController,
  resetCodeController,
  resetPasswordController
}