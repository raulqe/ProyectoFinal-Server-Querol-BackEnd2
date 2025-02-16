import { userServices } from "../services/user.services.js";
import { createHash } from "../utils/hash.password.js";
import { createToken } from "../utils/jwt.js";
import { UserDTO } from "../dao/dto/user.dto.js";
import { userDao } from "../dao/mongo/user.dao.js";

export class SessionsControllers {

    async register (req,res) {
        try {
            res.status(201).json({ status: "success", payload: "Registered user" });
    
        } catch (error) {
    
            res.status(500).json({status:"Error",msg:"Internal server error"});
        };
    };
    async login (req, res){
        try {
    
            const token= createToken(req.user);
            res.cookie("token", token,{ httpOnly:true });
            res.status(200).json({ status: "success", payload: req.user, token });
          
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Error", msg: "Internal server error." });
        };
    };
    async profile (req,res) {
        try { 
            
            if(!req.user) return res.status(404).json({ status: "Error", payload:" The user isn't logged." });
            if(!req.user.role ) return res.status(403).json({ status: "Error", payload:" The user isn't aturized on this area." });
                
            res.status(200).json({ status: "success", payload: req.user});
        
        } catch (error) {  
            res.status(500).json({status:"Error",msg:"Internal server error."});
        };
    };
    async  deleteSession (req,res) {
        try {
            
            req.session.destroy();

            res.status(200).json({ status: "success", payload:" The current session is ended." });
        } catch (error) {  
            res.status(500).json({status:"Error",msg:"Internal server error."});
        };
    };
    async restorePassword (req,res) {
        try {
            const {email,password} = req.body;
            const user = await userDao.getByEmail(email);
            await userDao.update(user._id,{password:createHash(password)});
            
             res.status(200).json({ status: "success", payload:" The password is updated." });
        } catch (error) {  
            res.status(500).json({status:"Error",msg:"Internal server error."});
        };
    };
    async googleLogin (req, res) {
    
        return res.status(200).json({status:"success", session:req.user});
    
    };
    async current(req,res) {
    
        const userFormat = new UserDTO(req.user);
        const user = userFormat;
        res.json({status:"success", user});  
    
    };
};
export const sessionsControllers = new SessionsControllers();