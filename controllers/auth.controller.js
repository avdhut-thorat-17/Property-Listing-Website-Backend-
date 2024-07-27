import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully" });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
    return;
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request:", req.body); // Log received data

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log("User not found");
      res.status(400).json({ message: "Invalid Credentials!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      res.status(400).json({ message: "Invalid Credentials!" });
      return;
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
    return;
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
  return;
};
