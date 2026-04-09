import { errorResponse, successResponse } from "../utils";
import { User, ClassRoom, Attendance } from "../models/dbModel.js";
import { ActiveSessionStore } from "../store/activeSession.store.js";

export const createClass = async (req, res) => {
  const payload = req.body;
  const Currentclass = payload._id;
  //checks if a class already exists
  if (!Currentclass) return errorResponse(res, "Class Already Exists", 401);
  try {
    const className = payload.className;
    const userId = payload.userId;

    const newClass = await ClassRoom.create({
      className,
      teacherId: userId,
    });

    if (!newClass)
      return errorResponse(err, "Error Occurred during Creating Class", 500);
    const newClassObject = newClass.toObject();

    const classResponse = {
        _id: newClassObject._id.toString(),
            className: newClassObject.className,
            teacherId: newClassObject.teacherId.toString(),
            studentIds: newClassObject.studentIds.map((id) => id.toString()),
        }
         return successResponse(res, classResponse, 201);
    
  } catch (err) {
    console.log(err);
    errorResponse(res, "Internal server error", 500);
  }
};

export const addStudentToClass = async (req, res) => {
  const { studentId } = req.body;
  const { classId } = req.params;

  try {
    
  } catch (err) {}
};
