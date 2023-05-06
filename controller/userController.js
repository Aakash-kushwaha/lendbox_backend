const {
  sessionModel,
  Step1Registration,
  Step2Registration,
  Step3Registration,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY || "supersecret123";
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const userRegister = async (req, res) => {
  const { mobile, name } = req.body;

  try {
    if (!mobile || !name)
      return res.status(400).json({ message: "All fields are required" });
    let user = await Step1Registration.findOne({ mobile });
    if (user)
      return res.status(400).json({
        message: "User already exists....",
        data: { userId: user._id },
      });
    user = new Step1Registration({ mobile, name });
    await user.save();

    res.status(200).json({
      message: "Mobile and name registered successfully",
      mobile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const userRegisterEmailPass = async (req, res) => {
  try {
    const { mobile, email, password } = req.body;
    if (!mobile || !email || !password)
      return res.status(400).json({ message: "All credentials required" });
    if (!validator.isEmail(email))
      return res.status(400).json("Email must be valid");
    const existingRegistration = await Step1Registration.findOne({ mobile });
    if (!existingRegistration) {
      return res.status(404).json({ message: "Mobile number not found" });
    }
    const existingStep2Registration = await Step2Registration.findOne({
      mobile,
    });
    if (existingStep2Registration) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const step2Registration = new Step2Registration({
      mobile,
      email,
      password: hashPassword,
    });
    const savedRegistration = await step2Registration.save();
    res.status(201).json({
      message: "Email registered successfully",
      registration: savedRegistration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const userRegisterDetails = async (req, res) => {
  try {
    const { mobile, email, PAN, father_Name, DOB } = req.body;
    if (!mobile || !email || !PAN || !father_Name || !DOB)
      return res.status(400).json({ message: "All credentials required" });
    const existingStep2Registration = await Step2Registration.findOne({
      mobile,
      email,
    });
    if (!existingStep2Registration) {
      return res.status(404).json({ message: "Email not found" });
    }
    const existingStep3Registration = await Step3Registration.findOne({
      mobile,
      email,
    });
    if (existingStep3Registration) {
      return res.status(409).json({ message: "Details already registered" });
    }
    const step3Registration = new Step3Registration({
      mobile,
      email,
      PAN,
      father_Name,
      DOB,
    });
    const savedRegistration = await step3Registration.save();
    res.status(201).json({
      message: "Details registered successfully",
      registration: savedRegistration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json("All fields are required");

    let user = await Step2Registration.findOne({ email });
    const isValiPassword = await bcrypt.compare(password, user.password);

    if (!user || !isValiPassword)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const token = createToken(user._id);

    let activesession = await sessionModel.find({userId:user._id});
    if (activesession.length >= 3) {
      return res
        .status(400)
        .json({ message: "Found more than 3 active session" });
    }

    let Session = new sessionModel({
      userId: user._id,
    });
    await Session.save();

    res.status(200).json({
      _id: user._id,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  userRegister,
  userRegisterEmailPass,
  userRegisterDetails,
  userLogin,
};
