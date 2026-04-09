import { errorResponse , verifytoken } from "../utils";
import { User } from '../models/schema.js';
import { TokenExpiredError } from "jsonwebtoken";

export const authMiddleware = async(req , res ,next)=>{
    const token = req.headers?.authorization;
    console.log(`the token in the headers is ${token} `)

    if(!token){
        return errorResponse(res , "Unauthorized! token is missing or invalid",401);
    }
    try{
        const decoded = verifytoken(token)
        if(!decoded){
            return errorResponse(res, "Unauthorized! token is missing or invalid" , 401)
        }
        const userId = decoded.userId;
        const user = await User.findById(userId)
        if(!user){
            return errorResponse(res , "User does not exist", 401)
        }
        req.user = decoded;
        console.log("Decoded token" + decoded)
        next();
    }catch(err){
         console.log(error);
        return errorResponse(res, "Unauthorized, token missing or invalid", 401);
    }
}

//checks the role of the user for route access-control
export const roleMiddleware = (role) => (req, res, next) => {
    const userRole = req.user?.role;
    if(userRole !== role){
        return errorResponse(res, "Forbidden, teacher access required", 403);
    }
    next();
}