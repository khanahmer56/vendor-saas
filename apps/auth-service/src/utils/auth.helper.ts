import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { redis } from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMails";
import { NextFunction } from "express";

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
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return next(new ValidationError("Invalid or expired OTP"));
  }
  const failedAttemptsKey = `otp_failed_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      return next(new ValidationError("Account locked for 5 minutes"));
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 60);
    return next(new ValidationError("Invalid OTP"));
  }
};
