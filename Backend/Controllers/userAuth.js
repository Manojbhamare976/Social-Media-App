import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import bcrypt from "bcrypt";

async function signup() {
  let { username, email, password } = req.body;
  let hashedPassword = bcrypt.hash(password, 10);

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
      console.log(err);
    });
}

export { signup };
