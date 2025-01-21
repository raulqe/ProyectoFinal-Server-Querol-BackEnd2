import passport from "passport";
import local from 'passport-local';
import { userDao } from "../dao/user.dao.js";
import { createHash,validatePassword } from "../utils/hash.password.js";

const LocalStrategy = local.Strategy;

export const initializedPassport = ()=>{
    passport.use("register",new LocalStrategy(
        {
            passReqToCallback:true,
            usernameField:"email"
        },
        async (req, username, password,done) => {
          try {
            const {first_name,last_name} = req.body;
            const user = await userDao.getByEmail(username);
            if(user) return done(null, false,{message: "The user already exists"})
            const newUser = {
                first_name,
                last_name,
                email: username,
                password:createHash(password)
            }
            const createUser=await userDao.create(newUser);
            done(null,createUser);

          } catch (error) {
            done(error)
          }
        }
    ));
    passport.use("login",new LocalStrategy({ usernameField: "email" },
        async (username, password, done ) => {
            try {
                const user = await userDao.getByEmail(username);
                const checkPasswrd = validatePassword(password,user);
                if(!user || !checkPasswrd) return done(null,false,{message:"Email or Password isn't valid"});
                done(null, user);
            } catch (error) {
                done(error);
            }
            
        }
    ));

    passport.serializeUser((user,done)=>{
        done(null, user._id);
    });
    passport.deserializeUser(async (id,done)=>{
       try {
        const user = await userDao.getById(id);
        done(null,user);
       } catch (error) {
        done(error);
       }
    })

   
}