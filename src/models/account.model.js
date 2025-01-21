import mongoose from "mongoose";

const accountsCollection= "accounts";

const accountsSchema = new mongoose.Schema({
    number: String,
    alias: String,
    balance: String,
    user_Id: String
});

export const accountsModel= mongoose.model(accountsCollection,accountsSchema);