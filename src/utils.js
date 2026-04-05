import jwt from "jsonwebtoken"

export const successResponse = (res, data, status=200)=>{
    return res.status(status).json({
        success : true,
        data,
    });
}


export const errorResponse  = (res, error, status = 500)=>{
     return res.status(status).json({
    success: false,
    error,
  });
}

export const generateToken = (payload)=>{
    const jwtSecret = process.env.JWT_SECRET
    if(!jwt){
        throw new Error("Jwt secret not defined in the environment variable")
    }
    return jwt.sign(payload , jwtSecret , {expiresIn : "1d"})
}


export const verifytoken = (token)=>{
try{
       const decoded=  jwt.verify(token , jwtSecret);
       return decoded
}catch(err){
    console.log("Error verifying the token :" , err)
    throw new Error("invalid token")
}
}   
module.exports = {successResponse, generateToken , verifytoken}