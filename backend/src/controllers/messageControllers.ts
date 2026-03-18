import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import { prisma } from "../prisma/prisma";
import { TestRequestMsg } from "../types/types";

export const sendMessages = async (
  req: Request<{ id: string }, {}, TestRequestMsg>,
  res: Response,
): Promise<void> => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?.id;

    if (!senderId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let imageUrl: string | undefined;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl ?? null,
      },
    });

    res.status(201).json({
      message: "Message has been created",
      newMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const filterUsers = await prisma.user.findMany({
      where: {
        id: { not: loggedInUserId },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePic: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      users: filterUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getMessages = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const myId = req.user?.id;
    const { id: userToChatId } = req.params;
    if (!myId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
