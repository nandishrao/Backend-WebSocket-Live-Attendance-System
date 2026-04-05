import { Class, User, Attendance } from "../models/schema.js";
import { ActiveSessionStore } from "../store/activeSession.store.js";
import { errorResponse, successResponse } from "../utils";

const createClass = async (req,res) => {
    //class details from the request body
    const payload  = req.body;
    try{
        const className = payload.className;
        const userId = req.user?.userId;
        
        const newClass = await new Class.create({
            className,
            userId : userId,
        })
        if(!newClass){
            return errorResponse(res,"Failed to create class" ,500)
        }
        const newClassObject = newClass.toObject();
        const classResponse = {
            _id: newClassObject._id.toString(),
            className: newClassObject.className,
            teacherId: newClassObject.teacherId.toString(),
            //one class can have many students
            studentIds: newClassObject.studentIds.map((id) => id.toString())
        }
        return successResponse(res,classResponse,201)
    }catch(err){
        console.log(error);
        errorResponse(res, "Internal server error", 500);
    }
}

export const addStudentToClass = async(req, res) => {
    const { studentId } = req.body;
    const { classId } = req.params;

    try {
        const isStudentExist = await User.findById(studentId);
        if(!isStudentExist || isStudentExist.role !== "student"){
            return errorResponse(res, "Student not found", 404);
        }

        const classExist = await Class.findById(classId);
        if(!classExist){
            return errorResponse(res, "Class not found", 404);
        }
        const teacherId = req.user?.userId;
        if(classExist.teacherId.toString() !== teacherId){
            return errorResponse(res, "Forbidden, not class teacher", 403);
        }

        if(classExist.studentIds.includes(studentId)){
            const response = {
                studentIds: [
                    ...classExist.studentIds.map((id) => id.toString())
                ]
            }
            return successResponse(res, response, 200);
        }

        classExist.studentIds.push(studentId);
        await classExist.save();
        const classObject = classExist.toObject();
        const classResponse = {
            _id: classObject._id.toString(),
            className: classObject.className,
            teacherId: classObject.teacherId.toString(),
            studentIds: classObject.studentIds.map((id) => id.toString()),
        }
        return successResonse(res, classResponse);

    } catch (error) {
        
    }
}

export const getClassDetails = async(req, res) => {
    const userId = req?.user?.userId;
    const { classId } = req.params;

    try {
        const getClass = await Class.findById(classId).populate('studentIds', '_id name email');
        if(!getClass){
            return errorResponse(res, "Class not found", 404);
        }

        console.log("getClass is", getClass);

        const { teacherId, studentIds } = getClass;
        if(teacherId.toString() !== userId && studentIds.map(id => id.toString()).includes(userId) === false){
            return errorResponse(res, "Forbidden, not class member", 403);
        }

        const classObject = getClass.toObject();
        const classResponse = {
            id: classObject._id.toString(),
            className: classObject.className,
            teacherId: classObject.teacherId.toString(),
            students: classObject.studentIds.map((student) => ({
                id: student._id.toString(),
                name: student.name,
                email: student.email,
            })),
        }
        return successResonse(res, classResponse);
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Internal server error", 500);
    }
}

export const getAllStudents = async(req, res) =>{
    try {
        const students = await User.find({
            role: 'student',
        })
        console.log("students are", students);

        if(!students){
            return errorResponse(res, "No students found", 404);
        }

        const studentsResponse = students.map((student) => ({
            id: student._id.toString(),
            name: student.name,
            email: student.email,
        }))

        return successResonse(res, studentsResponse);
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Internal server error", 500);
    }
}

export const getMyAttendance = async(req, res) => {
    const studentId = req.user?.userId;
    const classId = req.params.classId;

    try {
        const classExist = await Class.findById(classId);
        if(!classExist){
            return errorResponse(res, "Class not found", 404);
        }
        if(!classExist.studentIds.includes(studentId)){
            return errorResponse(res, "Forbidden, not class student", 403);
        }

        const attendanceRecord = await Attendance.find({
            classId,
            studentId,
        })

        console.log("attendanceRecord is", attendanceRecord);

        if(!attendanceRecord){
            return errorResponse(res, "No attendance record found", 404);
        }

        const attendanceRecordObject = attendanceRecord.map((record) => ({
            classId: record.classId.toString(),
            studentId: record.studentId.toString(),
            status: record.status ? record.status : null,
        }))

        return successResponse(res, attendanceRecordObject);
    } catch (error) {
        console.log(error);
        return errorResponse(res, "Internal server error", 500);
    }
}

export const startAttendanceSession = async(req, res) => {
    const { classId} = req.body;
    const teacherId = req.user?.userId;

    try {
        const classExist = await Class.findById(classId);
        if(!classExist){
            return errorResponse(res, "Class not found", 404);
        }

        if(classExist.teacherId.toString() !== teacherId){
            return errorResponse(res, "Forbidden, not class teacher", 403);
        }

        const session = ActiveSessionStore.getSession();
        if(session){
            return errorResponse(res, "An active session is already running", 400);
        }

        const newSession = ActiveSessionStore.startSession(classId);

        const newSessionResponse = {
            classId: newSession.classId,
            startedAt: newSession.startedAt,
        };
        return successResponse(res, newSessionResponse, 200);


    } catch (error) {
        console.log(error);
        return errorResponse(res, "Internal server error", 500);
    }
}