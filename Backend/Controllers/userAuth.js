import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

async function signup(req, res) {
  try {
    let { username, email, password } = req.body;

    if (!username) {
      return res.status(404).json({ msg: "Please enter username" });
    } else if (!email) {
      return res.status(404).json({ msg: "Please enter email" });
    } else if (!password) {
      return res.status(404).json({ msg: "Please enter password" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    let user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    console.log(accessToken);
    return res.json({
      msg: "signup successfull",
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function login(req, res) {
  try {
    let { username, email, password } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (!password || (!username && !email)) {
      return res.status(400).json({ msg: "Credentials missing" });
    }

    let isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json("Password did not match");
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    let refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      msg: "Login successfull",
      accessToken,
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

    res.clearCookie("refreshToken", {
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

async function refresh(req, res) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ msg: "Refresh token missing" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ accessToken: newAccessToken });
  });
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 10,
  message: "Too many login attempts",
});

async function authenticateUser(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(403).json({ msg: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Token invalid or expired" });
    }

    req.user = decoded;
    next();
  });
}

export { signup, login, logout, loginLimiter, refresh, authenticateUser };
