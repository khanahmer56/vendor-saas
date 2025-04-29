import { NextFunction, Request, Response } from "express";
import {
  otpCheckRestriction,
  sendOtp,
  trackOtpRestriction,
  validRegistrationData,
  verifyUser,
} from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
import { verify } from "crypto";

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
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Invalid Request data"));
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
  } catch (error) {
    return next(error);
  }
};
