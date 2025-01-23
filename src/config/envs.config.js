import 'dotenv/config';

export default {
    MONGO_URL:process.env.MONGO_URL,
    PORT:process.env.PORT, 
    SECRETKEY:process.env.SECRETKEY,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    GOOGLE_URL: process.env.GOOGLE_URL,
    TOKN_KEY: process.env.TOKN_KEY
}