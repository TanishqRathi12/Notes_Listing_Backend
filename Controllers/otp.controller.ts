const dotenv = require("dotenv");
const {createToken} = require("./Auth.Controller");
const Author = require("../models/User");
import { Request, Response } from "express";
const speakeasy = require("speakeasy");
const nodeMailer = require("nodemailer");
dotenv.config();


export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(400).send("Please fill all the fields");
      }
      const user = await Author.findOne({ email });
      if (!user) {
        return res.status(400).send("User does not exist");
      }
      const otp = speakeasy.totp({
        secret: process.env.OTP_SECRET,
        encoding: "base32",
        step: 300,
        digit: 6,
      });
      await SendMail(email, otp);
      res.status(200).send("OTP sent to email");
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    //console.log(otp);
    try {
      if (!email || !otp) {
        return res.status(400).send("Please fill all the fields");
      }
      const user = await findOne({email})
  
      const isValid = speakeasy.totp.verify({
        secret: process.env.OTP_SECRET,
        encoding: "base32",
        token: otp,
        step: 300,
        window: 2,
      });
      console.log(isValid);
      if (!isValid) {
        return res.status(400).send("Invalid OTP");
      } else {
       
        const token = createToken({ _id: user._id});
  
        res.status(200).json({ message: "OTP verified", token });
      }
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const SendMail = async (email: string, otp: number) => {
    try {
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      tls: {
        rejectUnauthorized: false,  
      },
      });
     
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for password reset",
        text: `Your OTP for password reset is: ${otp}. Please use this OTP to reset your password. This OTP is valid for 5 minutes.`,
      };
     // console.log(mailOptions);
     try{
       await transporter.sendMail(mailOptions);
     }catch(err){
      console.log(err);
    }
    } catch (err) {
      throw new Error("Failed to send OTP email");
    }
  };
  async function findOne({ email }: { email: string }) {
    try {
      const user = await Author.findOne({ email });
      return user;
    } catch (err) {
      throw new Error("Failed to find user");
    }
  }
