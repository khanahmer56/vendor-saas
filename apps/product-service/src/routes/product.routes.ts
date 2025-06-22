import express, { Router } from "express";
import { getCategories } from "../controllers/product.controller";

const router: Router = express.Router();
router.get("/get-product", getCategories);
export default router;
