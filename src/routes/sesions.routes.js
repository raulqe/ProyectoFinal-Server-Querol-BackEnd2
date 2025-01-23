import { Router } from "express";
import { userDao } from "../dao/user.dao.js";
import { createHash} from "../utils/hash.password.js";
import {createToken,verifyToken} from "../utils/jwt.js";
import { passportCall } from "../middlewares/passportCall.middelware.js";
import {authorization} from "../middlewares/authotirization.middleware.js"
import passport from "passport";




const router= Router();

router.post("/register",passportCall("register"), async (req,res) => {
    try {
        res.status(201).json({ status: "success", payload: "Registered user" });

    } catch (error) {

        res.status(500).json({status:"Error",msg:"Internal server error"});
    }
})

router.post("/login",passportCall("login"), async (req, res) => {
    try {

        const token= createToken(req.user);
        res.cookie("token", token,{ httpOnly:true });
        res.status(200).json({ status: "success", payload: req.user, token });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error." });
    }
})


router.get("/profile",async (req,res) => {
    try {

        if(!req.session.user ) return res.status(404).json({ status: "Error", payload:" The user isn't logged." });
        if(!req.session.user.role ) return res.status(403).json({ status: "Error", payload:" The user isn't aturized on this area." });
            
       res.status(200).json({ status: "success", payload: req.session.user});

    } catch (error) {  
        res.status(500).json({status:"Error",msg:"Internal server error."});
    }
})

router.delete("/logout",async (req,res) => {
    try {
        req.session.destroy();
        
       res.status(200).json({ status: "success", payload:" The current session is ended." });
    } catch (error) {  
        res.status(500).json({status:"Error",msg:"Internal server error."});
    }
})

router.put("/restore-Password",async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userDao.getByEmail(email);
        await userDao.update(user._id,{password:createHash(password)});
        
        res.status(200).json({ status: "success", payload:" The password is updated." });
    } catch (error) {  
        res.status(500).json({status:"Error",msg:"Internal server error."});
    }
})

router.get("/google",passport.authenticate("google",{
        scope:["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],
        session:false
    }),async (req, res) => {
    
    return res.status(200).json({status:"success", session:req.user});

})

router.get("/current", passportCall("jwt"),authorization("admin"), async (req,res) => {

    const token = req.cookies.token;

    const validToken = verifyToken(token);
    if(!validToken)return res.status(400).json({status:"Error",msg:"Not token."});
    const user = await userDao.getByEmail(validToken.email);
    
    res.json({status:"success", user});  

})


export default router;