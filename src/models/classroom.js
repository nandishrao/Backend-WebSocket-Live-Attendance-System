import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema({
    clasName : String,
    teacherId: String, // reference to User
    studentIds: []
})


module.exports = mongoose.model("ClassRoom" , classRoomSchema);
