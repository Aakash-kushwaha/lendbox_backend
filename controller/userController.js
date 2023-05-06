const { userModel, sessionModel } = require("../models/userModel");
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
    let user = await userModel.findOne({ mobile });
    console.log(user);
    if (user)
      return res.status(400).json({
        message: "User already exists....",
        data: { userId: user._id },
      });

    if (!mobile || !name)
      return res.status(400).json({ message: "All fields are required" });

    user = new userModel({ mobile, name });

    await user.save();
    res.status(200).json({
      message: "success",
      userId: user._id,
      mobile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const userRegisterEmailPass = async (req, res) => {
  const { userId, email, password } = req.body;

  try {
    if (!userId || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    let qualityCheck = await userModel.findOne({ email: email });
    if (qualityCheck)
      return res.status(400).json({
        message: "Email Id already registered"
      });

    let user = await userModel.findOne({ _id: userId });
    if (!user && user.mobile !== null) {
      return res.status(400).json({ message: "User doesn't exists...." });
    } else {
      const salt = await bcrypt.genSalt(10);
      user.email = email;
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;

      await user.save();

      res.status(200).json({
        message: "success",
        userId: user._id,
        email,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const userRegisterDetails = async (req, res) => {
  const { userId, PAN, fathers_Name, DOB } = req.body;

  try {
    if (!userId || !PAN || !fathers_Name || !DOB)
      return res.status(400).json("All fields are required");

    let user = await userModel.findOne({ _id: userId });
    console.log(user);

    if (!user && user.email !== null) {
      return res.status(400).json({ message: "User doesn't exists...." });
    } else {
      user.fathers_Name = fathers_Name;
      user.DOB = DOB;
      user.PAN = PAN;

      await user.save();
      res.status(200).json({
        message: "success",
        userId: user._id,
        PAN,
      });
    }
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

    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("User not found");

    const isValiPassword = await bcrypt.compare(password, user.password);

    if (!isValiPassword) return res.status(400).json("Invalid Password");

    let activesession = await sessionModel.find();
    if (activesession.length >= 3) {
      return res
        .status(400)
        .json({ message: "Found active session more than 3 " });
    } else {
      let Session = new sessionModel({
        userId: user._id,
      });
      await Session.save();
    }

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
