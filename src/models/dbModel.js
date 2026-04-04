import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {String},
    email : {String},
    password: {String}, // hashed with bcrypt
    role: "teacher" | "student"
})
const classRoomSchema = new mongoose.Schema({
    clasName : String,
    teacherId: String, // reference to User
    studentIds: {
        ref : "User"
    }
})

const attendenceSchema = new mongoose.Schema({
     classId: {
        ref : "ClassRoom"
     },
  studentId: {
    ref : "User"         
  },
  status: "present" | "absent"
})
const classRoom = mongoose.model("ClassRoom" , classRoomSchema);
const user= mongoose.model("User" , userSchema);
const attendence = mongoose.model("attendence" , attendenceSchema)


module.exports = classRoom;
module.exports = user;
module.exports = attendence;
