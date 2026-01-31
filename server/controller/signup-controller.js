const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const User = require('../model/user-model')
const sendEmail = require('../utils/mail-sender')
const getOTP = require('../utils/otp-generator')
const session = require('express-session')


const allowed_type = ['common', 'admin', 'staff'];

const signupController = [
  check('user_type')
    .custom((value) => {
      if (!allowed_type.includes(value)) {
        throw new Error("Undefined user type");
      }
      return true;
    }
    ),

  check('name')
    .notEmpty().withMessage('Name is required')
    .bail()
    .trim()
    .matches(/^[A-Za-z\s]+$/).withMessage('Name should only contain alphabets and spaces'),

  check('email')
    .trim()
    .isEmail().withMessage('Enter a valid email')
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),

  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

  check('confirm_password')
    .custom((value, { req }) => {
      console.log(value, req.body.password)
      if (value !== req.body.password) {
        throw new Error('Confirm password must be same as password');
      }
      return true;
    }),

  async (req, res) => {
    req.session.signup = {};
    const { user_type, name, email, password } = req.body;

    console.log(user_type, name, email, password);
    const errors = validationResult(req).array().map((err) => { return err.msg });
    console.log(errors)
    if (errors.length > 0){
      delete req.session.signup;
      return res.status(400).json({ errors });
    } 


    const existingUser = await User.findOne({ email });
    if (existingUser) {
     delete req.session.signup;
      return res.status(409).json({ errors: ["Email already registered"] });
    }

    let hashed_pass ="";

    try{
      hashed_pass = await bcrypt.hash(password, 13);
    }
    catch(err){
      console.log(err);
      delete req.session.signup;
      res.status(500).json({errors:["Internal Server Error"]});
      return;
    }
    
    req.session.signup = { 
      expiresAt: Date.now() + 10 * 60 * 1000,
      user_type: user_type,
      name: name,
      email: email,
      password: hashed_pass 

    };

    try {
      const OTP = getOTP();
      const hashed_otp = await bcrypt.hash(OTP, 5)
      req.session.signup.OTP = hashed_otp;
      const subject = "FCRIT Canteen Registration"
      const messageBody = "Your OTP :" + OTP;
      await sendEmail(email, subject, messageBody);
      res.status(200).json({ message: "OTP set" });
    }
    catch (err) {
      res.status(500).json({ errors: ['Internal server error.'] });
      delete req.session.signup;
      console.log(err);
    }
  }
];




 const otpValidationController =  [
  check("otp")
    .notEmpty().withMessage("OTP is required")
    .isNumeric().withMessage("OTP must be numeric")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
  ,

  async (req, res) => {

    const signupSession = req.session.signup;

    if(!signupSession){
      return res.status(400).json({ errors:[ "Signup session expired" ]});
    }

    if (Date.now() > signupSession.expiresAt) {
    delete req.session.signup;
    return res.status(400).json({ error: "OTP expired" });
  }

    req.session.signup.otpAttempts = (req.session.signup.otpAttempts || 0) + 1;

    if (req.session.signup.otpAttempts > 5) {
     delete req.session.signup;
      return res.status(429).json({
        errors: ["Too many invalid attempts. Please sign up again."]
      });
    }


    let errors = validationResult(req).array().map((err) => { return err.msg });
    if (errors.length > 0) return res.status(400).json({ errors });

    const { otp } = req.body;

      try {
        const result = await bcrypt.compare(otp, req.session.signup.OTP)
        if (result) {
          const { user_type, name, email, password } = req.session.signup;
          const user = new User({ user_type, name, email, password });
          const savedDoc = await user.save();
          console.log(savedDoc);
          res.status(200).json({ savedDoc });
          delete req.session.signup;
        }
        else {
          res.status(400).json({ errors: ["Invalid OTP"] })
        }
      }
      catch (err) {
        console.log(err);
        res.status(500).json({ errors: ["Internal server error"] })
        delete req.session.signup;
      }
    

    
  }
];

module.exports = {
  signupController,
  otpValidationController
};


