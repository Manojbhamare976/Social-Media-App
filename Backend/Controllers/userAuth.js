import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function signup(req, res) {
  try {
    let { username, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log();
    let user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    user
      .save()
      .then(() => {
        console.log("User created successfully");
      })
      .catch((err) => {
        return console.log(err.message);
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    console.log(token);
    return res.json({
      msg: "signup successfull",
      token,
    });
  } catch (err) {
    return console.log(err.message);
  }
}

async function login(req, res) {
  try {
    let { username, email, password } = req.body;

    let user = await User.findOne({ username: username, email: email });

    if (!user) {
      return res.status(404).json("Cannot find user");
    }

    let isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json("Password did not match");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      msg: "Login successfull",
      token,
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
}

export { signup, login, logout };
