const Author = require("../models/User");
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { email, password, dob, name } = req.body;
  try {
    if (!email || !password || !dob || !name) {
      return res.status(400).send("Please fill all the fields");
    }
    
    const userExist = await Author.findOne({ email });
   
    if (userExist) {
      return res.status(400).send("User already exists");
    }
    
    const user = new Author({ email, password, dob, name });
    await user.save();
    const token = createToken({ _id: user._id });
    res.status(201).json({message:"User created",token});
  } catch (err) {
    res.status(500).send(err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("Please fill all the fields");
    }
    const user = await Author.findOne({ email });
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = createToken({_id: user._id  });
    res.status(200).json({ message: "User Logged in", token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  };
