// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import prisma from "../libs/prisma";

// export const isAuthenticated = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("req.cookies123334", req.cookies["seller_access_token"]);
//     const token =
//       req.cookies["access_token"] ||
//       req.cookies["seller_access_token"] ||
//       req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorizeda" });
//     }
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
//       id: string;
//       role: "user" | "seller";
//     };
//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     let account;
//     if (decoded.role === "user") {
//       account = await prisma.users.findUnique({
//         where: {
//           id: decoded.id,
//         },
//       });
//     } else if (decoded.role === "seller") {
//       account = await prisma.sellers.findUnique({
//         where: {
//           id: decoded.id,
//         },
//         include: { shop: true },
//       });
//       req.seller = account;
//     }

//     if (!account) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     req.role = decoded.role;
//     return next();
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from cookies or Authorization header
    const token =
      req.cookies?.access_token ||
      req.cookies?.seller_access_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id?: string;
      role?: "user" | "seller";
    };

    // 3. Validate decoded data
    if (!decoded?.id || !decoded?.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token payload" });
    }

    // 4. Fetch user or seller from DB
    let account = null;
    if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true },
      });
      req.seller = account;
    }

    // 5. Check account existence
    if (!account) {
      return res.status(401).json({ message: "Unauthorized: No such account" });
    }

    // 6. Attach role and continue
    req.role = decoded.role;
    req.userId = decoded.id; // optional for easier access later
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
