import { Router } from "express";
import { sendOtp } from "../Controllers/otp.controller";
import { resetPassword } from "../Controllers/otp.controller";


const OtpRouter = Router();

OtpRouter.get('/health',(req,res)=>{
    res.send('Ok!');
});

OtpRouter.post('/sendotp',(req,res)=>{
    sendOtp(req,res);
});

OtpRouter.post('/loginByOtp',(req,res)=>{
    resetPassword(req,res);
});

export default OtpRouter;

