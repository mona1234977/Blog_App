const UsersModel = require("../models/userModel");
const apiResponse = require("../helpers/apiResponse");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(
      res,
      "Validation error",
      errors.array()
    );
  }
  try {
    const { username, email, password } = req.body;

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return apiResponse.ErrorResponse(res, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7 days",
    });

    return apiResponse.successResponseWithData(
      res,
      "User registered successfully",
      { user: newUser, token }
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.findOne({ email });
    if (!user) {
      return apiResponse.ErrorResponse(res, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return apiResponse.ErrorResponse(res, "Invalid email or password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7 days",
    });
    return apiResponse.successResponseWithData(res, "Login successful", {
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.find();
    return apiResponse.successResponseWithData(
      res,
      "Users retrieved successfully",
      users
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Users Not Found");
  }
};

const userController = {
  register,
  UserLogin,
  getAllUsers,
};

module.exports = userController;
