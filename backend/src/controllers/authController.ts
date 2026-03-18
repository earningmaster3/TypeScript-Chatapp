import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";
import { TestRequestBody } from "../types/types";
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
):Promise<void> => {
  try {
    const { fullName, email, password, profilePic } = req.body;

    if (!fullName || !email || !password) {
       res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    if (password.length < 6) {
       res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser)
       res.status(400).json({ error: "User already exists" });

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
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (error: unknown) {
    // const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });

    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (!existingUser) return res.status(400).json({ error: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    const token = generateToken(existingUser.id, res);

    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid credentials" });

    res
      .status(200)
      .json({ message: "Login successful", user: existingUser, token });
  } catch (error) {
    return res.status(200).json({ message: "Login successful" });
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

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
      },
    });
    return res.status(200).json({
      message: "user authenticated successfully",
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
