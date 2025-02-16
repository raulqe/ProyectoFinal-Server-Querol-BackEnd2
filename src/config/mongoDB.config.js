import mongoose from 'mongoose';
import envsConfig from "./envs.config.js";

 export class ConnectDB {
    static #instance;
    static getConnection(){
        (!ConnectDB.#instance) ?
            (
                ( mongoose.connect(envsConfig.MONGO_URL) ),
                ( ConnectDB.#instance = mongoose.Connection ),
                ( console.log("Mongo DB is connected Propperly") )
            )
        : console.log("Mongo DB is already connected");

        return ConnectDB.#instance;
    }
}