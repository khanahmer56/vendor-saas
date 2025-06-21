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
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookies } from "../utils/cookies/setCookies";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // ✅ Correct
});

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
export const refreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // const refreshToken = req.cookies.refresh_token;
    const refreshToken =
      req.cookies["refresh_token"] ||
      req.cookies["seller_refresh_token"] ||
      req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      throw new ValidationError("Please login first");
    }
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (!decoded || !decoded.id || !decoded.role) {
      throw new JsonWebTokenError("Invalid token");
    }
    let account;
    if (decoded.role === "user") {
      account = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: {
          id: decoded.id,
        },
        include: { shop: true },
      });
    }
    if (!account) {
      throw new ValidationError("User not found");
    }
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw new ValidationError("User not found");
    }
    const newAccessToken = jwt.sign(
      { id: user.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    if (decoded.role === "user") {
      setCookies(res, "access_token", newAccessToken);
    } else if (decoded.role === "seller") {
      setCookies(res, "seller_access_token", newAccessToken);
    }
    req.role = decoded.role;
    return res.status(200).json({
      message: "Token refreshed successfully",
      access_token: newAccessToken,
      success: true,
    });
  } catch (error) {}
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
export const getuser = async (req: any, res: Response, next: NextFunction) => {
  console.log("hii");
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!user) {
      return next(new ValidationError("User not found"));
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validRegistrationData(req.body, "seller");
    const { name, email } = req.body;
    const existingSeller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });
    if (existingSeller) {
      return next(new ValidationError("User with this email already exists"));
    }
    await otpCheckRestriction(email, next);
    await trackOtpRestriction(email, next);
    await sendOtp(email, name, "seller-activation");
    res.status(200).json({
      message: "Otp sent to email. Please verify your account",
    });
  } catch (error) {
    return next(error);
  }
};
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;
    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("All fields are required"));
    }
    const existingSeller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });
    if (existingSeller) {
      return next(new ValidationError("User with this email already exists"));
    }
    await verifyUser(email, otp, next);
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const seller = await prisma.sellers.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        country: country,
        phone_number: phone_number,
      },
    });
    res.status(200).json({
      message: "Seller registered successfully",
      seller,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;
    if (
      !name ||
      !bio ||
      !address ||
      !opening_hours ||
      !website ||
      !category ||
      !sellerId
    ) {
      return next(new ValidationError("All fields are required"));
    }
    const shopData: any = {
      name,
      bio,
      address,
      opening_hours,
      category,
      sellerId,
    };
    if (website && website.trim() !== "") {
      shopData.website = website;
    }
    const shop = await prisma.shops.create({
      data: shopData,
    });
    res.status(200).json({
      message: "Shop created successfully",
      shop,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export const connectStripe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) {
      return next(new ValidationError("Seller id is required"));
    }
    const seller = await prisma.sellers.findUnique({
      where: {
        id: sellerId,
      },
    });
    if (!seller) {
      return next(new ValidationError("Seller not found"));
    }
    const url = await stripe.accounts.create({
      type: "express",
      email: seller.email,
      country: "GB",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        stripeId: url.id,
      },
    });
    const accountLink = await stripe.accountLinks.create({
      account: url.id,
      refresh_url: "http://localhost:3000/success",
      return_url: "http://localhost:3000/success",
      type: "account_onboarding",
    });
    res.status(200).json({
      message: "Stripe connected successfully",
      url: accountLink.url,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("All fields are required"));
    }
    const seller = await prisma.sellers.findUnique({
      where: {
        email: email,
      },
    });
    if (!seller) {
      return next(new ValidationError("seller with this email does not exist"));
    }
    const isPasswordValid = await bcrypt.compare(password, seller.password!);
    if (!isPasswordValid) {
      return next(new ValidationError("Invalid email or password"));
    }
    const token = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      }
    );
    const refreshToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    setCookies(res, "seller_refresh_token", refreshToken);
    setCookies(res, "seller_access_token", token);
    res.status(200).json({
      message: "seller logged in successfully",
      seller,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSeller = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const seller = await prisma.sellers.findUnique({
      where: {
        id: req.seller.id,
      },
      include: {
        shop: true,
      },
    });
    if (!seller) {
      return next(new ValidationError("seller not found"));
    }
    res.status(200).json({
      message: "seller fetched successfully",
      seller,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) {
      return next(new ValidationError("Seller id is required"));
    }
    const seller = await prisma.sellers.findUnique({
      where: {
        id: sellerId,
      },
    });
    if (!seller) {
      return next(new ValidationError("Seller not found"));
    }
    const account = await stripe.accounts.create({
      type: "express",
      country: "IN",
      email: seller.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        stripeId: account.id,
      },
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/success",
      return_url: "http://localhost:3000/success",
      type: "account_onboarding",
    });
    res.status(200).json({
      message: "Stripe connected successfully",
      url: accountLink.url,
      success: true,
    });
  } catch (error) {}
};
