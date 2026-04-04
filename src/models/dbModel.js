import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["teacher", "student"]
  }
});

const classRoomSchema = new mongoose.Schema({
  className: String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  studentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const attendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassRoom"
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["present", "absent"]
  }
});

const ClassRoom = mongoose.model("ClassRoom", classRoomSchema);
const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

export { ClassRoom, User, Attendance };