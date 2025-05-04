import express, { Router } from "express";

import {
  loginUser,
  resetUserpassword,
  userForgetPassword,
  userRegitration,
  verifyOtp,
  verifyUserForgetPassword,
} from "../controller/auth.controller";

const router: Router = express.Router();
router.post("/user-registration", userRegitration);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/forget-password", userForgetPassword);
router.post("/reset-password", resetUserpassword);
router.post("/verify-forget-password", verifyUserForgetPassword);
export default router;
