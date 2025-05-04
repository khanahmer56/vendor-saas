import { NextFunction, Request, Response } from "express";
import {
  handleForgetPassword,
  otpCheckRestriction,
  sendOtp,
  trackOtpRestriction,
  validRegistrationData,
  verifyForgetPasswordOtp,
  verifyUser,
} from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
import { verify } from "crypto";
import jwt from "jsonwebtoken";
import { setCookies } from "../utils/cookies/setCookies";

export const userRegitration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validRegistrationData(req.body, "user");
    const { name, email } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return next(new ValidationError("User with this email already exists"));
    }
    await otpCheckRestriction(email, next);
    await trackOtpRestriction(email, next);
    await sendOtp(email, name, "user-activation-mail");
    res.status(200).json({
      message: "Otp sent to email. Please verify your account",
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;
    console.log("all", email, otp, password, name);
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required"));
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return next(new ValidationError("User with this email already exists"));
    }
    await verifyUser(email, otp, next);
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "User registered successfully",
      user,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("All fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return next(new ValidationError("User with this email does not exist"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return next(new ValidationError("Invalid email or password"));
    }
    const token = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    setCookies(res, "refresh_token", refreshToken);
    setCookies(res, "access_token", token);
    res.status(200).json({
      message: "User logged in successfully",
      user,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const userForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgetPassword(req, res, next, "user");
};
export const verifyUserForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgetPasswordOtp(req, res, next);
};
export const resetUserpassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("All fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return next(new ValidationError("User with this email does not exist"));
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(
        new ValidationError("New password cannot be same as old password")
      );
    }
    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
