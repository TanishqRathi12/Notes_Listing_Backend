import { Router } from "express";
import { register } from "../Controllers/Auth.Controller";
import { login } from "../Controllers/Auth.Controller";

const AuthRouter = Router();

AuthRouter.get('/health',(req,res)=>{
    res.send('Ok!');
});

AuthRouter.post('/register',(req,res)=>{
    register(req,res);
});

AuthRouter.post('/login',(req,res)=>{
    login(req,res);
});

export default AuthRouter;
