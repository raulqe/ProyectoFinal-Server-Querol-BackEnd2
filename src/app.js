import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/index.routes.js";
import "dotenv/config";
import {connectDB} from "./config/mongoDB.config.js";
import envsConfig from "./config/envs.config.js";
import{initializedPassport} from "./config/passport.config.js"


const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api",router);

app.use(
    session({
        secret: "secretKey", // Cambia esto por algo más seguro en producción
        resave: false, // Evita guardar sesiones si no hay cambios
        saveUninitialized: false, // No guarda sesiones vacías
        store: MongoStore.create({
            mongoUrl: envsConfig.MONGO_URL, // URI de tu base de datos MongoDB
            ttl: 24 * 60 * 60, // Tiempo de vida de la sesión en segundos (1 día en este caso)
        }),
        cookie: {
            secure: false, // Cambiar a true si usas HTTPS
            maxAge: 1000 * 60 * 60 * 24, // Tiempo de expiración de la cookie en ms (1 día)
        },
    })
);
// app.use(
//     session({
//         secret: "secretKey",
//         resave: true,
//         saveUninitialized:true,
//         cookie: { secure: false }
//     })
// );
initializedPassport()



app.listen(envsConfig.PORT,()=>{
 console.log(`Server is listen on port ${envsConfig.PORT}`);
 
})