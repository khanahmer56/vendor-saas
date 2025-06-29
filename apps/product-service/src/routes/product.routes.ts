import express, { Router } from "express";
import {
  createDiscountCode,
  deleteDiscountCode,
  getCategories,
  getDiscountCodes,
} from "../controllers/product.controller";
import { isAuthenticated } from "../../../../packages/middleware/isAuthenticted";

const router: Router = express.Router();
router.get("/get-product", getCategories);
router.post("/create-discount-code", isAuthenticated, createDiscountCode);
router.get("/get-discount-code", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);
export default router;
