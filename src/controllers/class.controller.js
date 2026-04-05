import { Class, User, Attendance } from "../models/schema.js";
import { ActiveSessionStore } from "../store/activeSession.store.js";

const createClass = async (req,res) => {
    //class details from the request body
    const payload  = req.body;
    try{
        const className = payload.className;
        const userId = req.user?.userId;
    }catch(err){
        
    }
}

