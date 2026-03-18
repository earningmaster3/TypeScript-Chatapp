import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: String, res: Response) =>{


    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET!,
        {expiresIn: "1d"}
    )

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token

}


