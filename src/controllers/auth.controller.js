import { User } from "../models/dbModel";
import { errorResponse, successResponse } from "../utils";

export const signUp = async(req,res)=>{
    const payload = req.body;

    try{

        //first checking if the user already exists 
        const existingUser = await User.findOne({email : payload.email})
        if(existingUser){
            return errorResponse(res , "Email already exist" , 400)
        }
        const hashPassword = await bycrpt.hash(payload.password, 10)

        const user = new User({
            ...payload,
            password : hashPassword
        })
        await user.save()
        console.log(user)
        
        //handeling response 
        const userObject = user.toObject();
        const userResponse = {
            _id : userObject._id,
            name : userObject.name,
            email: userObject.email,
            role: userObject.role,
        }
        return successResponse(res, userResponse,201)
    }catch(err){

    }       

}