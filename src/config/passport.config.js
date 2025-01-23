import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import envsConfig from './envs.config.js';
import { userDao } from "../dao/user.dao.js";
import { createHash,validatePassword } from "../utils/hash.password.js";
import { cookieExtractor } from "../utils/cookiesExtract.js"

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;
const JwtEstrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializedPassport = ()=>{
    passport.use("register",new LocalStrategy(
        {
            passReqToCallback:true,
            usernameField:"email"
        },
        async (req, username, password,done) => {
          try {
            const {first_name,last_name,role} = req.body;
            const user = await userDao.getByEmail(username);
            if(user) return done(null, false,{message: "The user already exists"})
            const newUser = {
                first_name,
                last_name,
                email: username,
                password:createHash(password),
                role
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
    
    passport.use("google", new GoogleStrategy({
        clientID: envsConfig.CLIENT_ID,
        clientSecret: envsConfig.CLIENT_SECRET,
        callbackURL: envsConfig.GOOGLE_URL

    },
    async(accessToken, refreshToken, profile, cb)=>{
        try {
            console.log(profile);
            
           const {name,emails} = profile
               const user = await userDao.getByEmail(emails[0].value);
               if(user) return cb(null,user);

               const newUser= await userDao.create({
                   first_name: name.givenName,
                   last_name: name.familyName,
                   email: emails[0].value
               })
               return cb(null,newUser)
            
        } catch (error) {
            cb(error)
        }
    }
    ));

    passport.use("jwt",new JwtEstrategy({jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),secretOrKey:envsConfig.TOKN_KEY},
    async(jwt_payload,done)=>{
        try {
            const { email } = jwt_payload;
            const user = await userDao.getByEmail(email)
            done(null, user);
        } catch (error) {
            done(error);
        }

    }))



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