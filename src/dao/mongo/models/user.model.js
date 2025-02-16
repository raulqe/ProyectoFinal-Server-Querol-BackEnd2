import mongoose,{Types} from "mongoose";

const userCollection= "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
    },
    password: String,
    role:{
        type:String,
        default: "user"
    },
    cart:{type: mongoose.Schema.Types.ObjectId, ref:"cart"},
    account: { type: mongoose.Schema.Types.ObjectId, ref:"accounts"}
});

export const userModel= mongoose.model(userCollection,userSchema);