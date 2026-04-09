import { User } from "../models/dbModel.js";
import { errorResponse, generateToken, successResponse } from "../utils.js";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  const payload = req.body;

  try {
    //first checking if the user already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return errorResponse(res, "Email already exist", 400);
    }
    const hashPassword = await bycrpt.hash(payload.password, 10);

    const user = new User({
      ...payload,
      password: hashPassword,
    });
    await user.save();
    console.log(user);

    //handeling response
    const userObject = user.toObject();
    const userResponse = {
      _id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
    };
    return successResponse(res, userResponse, 201);
  } catch (err) {
    console.log(err);
    return errorResponse(err, "Something went wrong", 500);
  }
};

const login = async (req, res) => {
  const payload = req.body;

  try {
    //we have the user data if the user exist
    const user = await User.findOne({
      email: payload.email,
    });
    if (!user) {
      return errorResponse(res, "User not found", 400);
    }

    const isPasswordValid = bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) return errorResponse(res, "Invalid Credentials", 400);
    const jwtpayload = (jwtpayload = {
      userId: user._id.toString(),
      role: user.role,
    });
    const token = generateToken(jwtpayload);
    return successResponse(res, { token });
  } catch (err) {
    console.log("ERROR: ", err);
    return errorResponse(err, "SERVER ERROR", 500);
  }
};

const me = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOne({
      userId: userId,
    });
    if (!user) {
      return errorResponse(err, "User not found", 400);
    }
    const userObject = user.toObject();
    const userResponse = {
      _id: userObject._id.toString(),
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
    };

    return successResponse(res, userResponse);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Internal server error", 500);
  }
};

export default {
  signUp,
  login,
  me,
};
