import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req,res) =>{
    console.log(req.userId)

    res.status(200).json("You are Authenticated")
}

export const shouldBeAdmin = (req,res) =>{
    // console.log("hi")
}