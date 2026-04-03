import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {String},
    email : {String},
    password: {String}, // hashed with bcrypt
    role: "teacher" | "student"
})

module.exports= mongoose.model("User" , userSchema);