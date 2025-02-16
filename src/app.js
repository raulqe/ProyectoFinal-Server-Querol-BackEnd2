import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/index.routes.js";
import "dotenv/config";
import envsConfig from "./config/envs.config.js";
import{initializedPassport} from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./config/mongoDB.config.js";



const app = express();

ConnectDB.getConnection();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(
    session({
    
        secret:envsConfig.SECRETKEY,
        resave: false, 
        saveUninitialized: false, 
        store: MongoStore.create({
            mongoUrl: envsConfig.MONGO_URL,
            ttl: 24 * 60 * 60, 
        }),
        cookie: {
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24, 
        },
    })
);

initializedPassport();

app.use(cookieParser());
app.use("/api",router);

app.listen(envsConfig.PORT,()=>{
    console.log(`Server is listen on port ${envsConfig.PORT}`);
 
});