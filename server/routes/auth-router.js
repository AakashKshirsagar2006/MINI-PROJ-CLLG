const express = require('express');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../model/user-model')
const getOTP = require('../utils/otp-generator');
const sendEmail = require('../utils/mail-sender');

const getResetPasswordResetCode = require('../utils/pass-reset-code-generator')
const {signupController,otpValidationController} = require('../controller/signup-controller')
const {loginController,autoLoginController,logoutController} = require('../controller/login-controller')

const {emailVerificationController,resetCodeController,resetPasswordController} = require('../controller/reset-password-controller');

const {isGmail} = require('../utils/userID-validator')
const allowed_type = ['common', 'admin', 'staff'];


router.post('/signup', signupController);
router.post('/signup/validate-otp',otpValidationController)


router.post('/login',loginController);
router.get('/recognize-me',autoLoginController);
router.post('/logout',logoutController);

router.post('/reset-password',emailVerificationController)
router.post('/reset-password/reset-code',resetCodeController)
router.post('/reset-password/update-password',resetPasswordController)

module.exports = router;

