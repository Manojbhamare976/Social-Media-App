import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function signup(req, res) {
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

  console.log(token);
  res.json(token);
}

async function login(req, res) {
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

  return res.json({
    msg: "Login successfull",
    token,
  });
}

export { signup, login };
