import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { redis } from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMails";
import { NextFunction, Request, Response } from "express";
import prisma from "../../../../packages/libs/prisma";
import { verifyOtp } from "../controller/auth.controller";

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Invalid Request data");
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email address");
  }
};

export const otpCheckRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Account locked for 5 minutes"));
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Account locked for 5 minutes"));
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("Please wait for 1 minute"));
  }
};
export const trackOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequest = parseInt((await redis.get(otpRequestKey)) || "0");
  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(new ValidationError("Account locked for 5 minutes"));
  }
  await redis.set(otpRequestKey, otpRequest + 1, "EX", 60);
};
export const sendOtp = async (
  email: string,
  name: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 60 * 5);
  await redis.set(`otp_cooldown:${email}`, 0, "EX", 60);
};
export const verifyUser = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = parseInt((await redis.get(`otp:${email}`)) || "0");
  console.log("storedOtp", typeof storedOtp, typeof otp);
  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP");
  }
  const failedAttemptsKey = `otp_failed_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
  if (storedOtp !== +otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError("Account locked for 5 minutes");
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 60);
    throw new ValidationError("Invalid OTP");
  }
};

export const handleForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError("Email is required");
    }
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({
        where: { email },
      }));
    if (!user) {
      throw new ValidationError(`${userType} not found`);
    }
    await otpCheckRestriction(email, next);
    await trackOtpRestriction(email, next);
    await sendOtp(email, user.name, "forget-password");
    res.status(200).json({
      message: "Otp sent to email. Please verify your account",
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyForgetPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ValidationError("All fields are required");
    }
    await verifyOtp(email, otp, next);
  } catch (error) {}
};
