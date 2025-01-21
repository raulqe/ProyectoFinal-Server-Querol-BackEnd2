import { Router } from "express";
// import expresSession from "express-session"
import { userDao } from "../dao/user.dao.js";
import { createHash,validatePassword } from "../utils/hash.password.js";
import passport from "passport";



const router= Router();

router.post("/register",passport.authenticate("register"), async (req,res) => {
    try {
        // const userData = req.body
        
        // const findEmail =  await userDao.getByEmail(userData.email) 
        // if(findEmail) return res.status(400).json({ status: "error", msg:"That User already exists"})

        // const newUser = {...userData, password: createHash(userData.password)}
        // const user = await userDao.create(newUser)

        res.status(201).json({ status: "success", payload: "Registered user" });
    } catch (error) {

        res.status(500).json({status:"error",msg:"Internal server error"});
    }
})

router.post("/login",passport.authenticate("login"), async (req, res) => {
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email
      }

      // const { email, password } = req.body;
      // const user = await userDao.getByEmail(email);
      // const checkPasswrd = validatePassword(password,user)

      // req.body.user = {
      //   email,
      //   role: "user"
      // }
      
      // if(!user || !checkPasswrd) return res.status(401).json({status: "error", msg:"Email or Password isn't valid" });
      
      // console.log(req.body.user);
      // console.log(user);
      // // Guardamos la información del usuario en la session
      // // req.sessionStore = {
      // //   email,
      // //   role: "user"
      // // }
    
      // // console.log(req.sessionStore);
      
      res.status(200).json({status: "success", payload: req.session.user})
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Internal server error" });
    }
  })

// router.post("/login", async (req,res) => {
//     try {
//         const {email,password} = req.body;
//         const user = await userDao.getByEmail(email);
//         // await req.session.user.email
//         if(!user||user.password !== password ) return res.status(400).json({status:"error",msg:"Email or Password isn't valid"});
//         //###revisar esta parte sesion####//
//         console.log(req);
        
//          req.session={email:email}
//         // req.session = {email:req.body.email}
//         // console.log(req.session);
        
//         res.status(200).json({ status: "success", payload: user});
//     } catch (error) {
//         console.log(error);
        
//         res.status(500).json({status:"error",msg:"Internal server error"});
//     }
// })

router.get("/profile",async (req,res) => {
    try {
    
        const saveSesion= req.session
        console.log(saveSesion);
        
       res.status(200).json({ status: "success", payload:{saveSesion} });
    } catch (error) {  
        res.status(500).json({status:"error",msg:"Internal server error"});
    }
})
router.get("/logout",async (req,res) => {
    try {
       req.session.destroy();
        console.log(req.session);
        
       res.status(200).json({ status: "success", payload:" The current session is ended" });
    } catch (error) {  
        res.status(500).json({status:"error",msg:"Internal server error"});
    }
})
router.put("/restore-Password",async (req,res) => {
  try {
    const {email,password}=req.body
    const user = await userDao.getByEmail(email);
    await userDao.update(user._id,{password:createHash(password)})
      
     res.status(200).json({ status: "success", payload:" The password is updated" });
  } catch (error) {  
      res.status(500).json({status:"error",msg:"Internal server error"});
  }
})


export default router;