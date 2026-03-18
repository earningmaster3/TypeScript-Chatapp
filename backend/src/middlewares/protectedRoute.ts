import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma";
import { redis } from "../lib/redis";

// extend Express Request to carry user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const protectedRoute = async(req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Token not found" });

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decode) return res.status(401).json({ error: "Invalid token" });

    const cacheUser = await redis.get(`user:${decode.userId}`);
    if (cacheUser) {
        req.user = cacheUser as typeof req.user;
        return next();
    } 
    
    const user = await prisma.user.findUnique({ 
        where: { id: decode.userId },
        select: { id: true, email: true, fullName: true, profilePic: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    await redis.set(`user:${decode.userId}`, user, { ex: 60 * 60 * 24 * 7 });

    req.user = user;
    next();
};

