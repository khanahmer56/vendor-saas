import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.cookies", req.cookies);
    const token =
      req.cookies.access_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorizeda" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const account = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!account) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = account;
    return next();
  } catch (error) {}
};
