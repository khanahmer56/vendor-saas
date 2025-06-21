import express, { Router } from "express";

import {
  connectStripe,
  createShop,
  getSeller,
  getuser,
  loginSeller,
  loginUser,
  registerSeller,
  resetUserpassword,
  userForgetPassword,
  userRegitration,
  verifyOtp,
  verifySeller,
  verifyUserForgetPassword,
} from "../controller/auth.controller";
import { isAuthenticated } from "../../../../packages/middleware/isAuthenticted";
import { isSeller } from "../../../../packages/middleware/authorizeRole";

const router: Router = express.Router();
router.post("/user-registration", userRegitration);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/forget-password", userForgetPassword);
router.get("/get-user", isAuthenticated, getuser);
router.post("/reset-password", resetUserpassword);
router.post("/verify-forget-password", verifyUserForgetPassword);
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/create-stripe-link", connectStripe);
router.post("/login-seller", loginSeller);
router.get("/get-seller-details", isAuthenticated, isSeller, getSeller);

export default router;
