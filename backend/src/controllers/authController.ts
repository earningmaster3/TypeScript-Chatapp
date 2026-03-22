import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";
import { TestRequestBody, LoginRequestBody } from "../types/types";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/generateToken";
import cloudinary from "../lib/cloudinary";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";

export const test = (req: Request, res: Response) => {
  res.send("test Controller");
};

export const signup = async (
  req: Request<{}, {}, TestRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { fullName, email, password, profilePic } = req.body;

    if (!fullName || !email || !password) {
       res
        .status(400)
        .json({ error: "Please provide all required fields" });
        return;
    }

    if (password.length < 6) {
       res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
        return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser){
      res.status(400).json({ error: "User already exists" });
      return;
    }
       

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        profilePic: "",
      },
    });

    const token = generateToken(newUser.id, res);
    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
    return;
  } catch (error: unknown) {
    // const errorMessage = error instanceof Error ? error.message : "Unknown error";
     res.status(500).json({ error: "Something went wrong" });
     return;
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response):Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
       {res
        .status(400)
        .json({ error: "Please provide all required fields" });
        return;
       }
        
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser) {res.status(400).json({ error: "User not found" }); return;}

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(existingUser.id, res);

    res.status(200).json({
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
     return;
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    await redis.del(`user:${decode.userId}`);
    res.clearCookie("jwt");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successful" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user?.id;

    if (!profilePic)
      return res.status(400).json({ error: "Please provide profile picture" });

    const uploaderResponse = await cloudinary.uploader.upload(profilePic);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePic: uploaderResponse.secure_url },
    });

    if (!user) return res.status(400).json({ error: "User not found" });
    // ✅ check if user exists before updating
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - no userId" });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
      },
    });

    console.log("checkAuth - found user:", user);

    return res.status(200).json({
      id: userId,
      fullName: user?.fullName,
      email: user?.email,
      profilePic: user?.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
