import express, { Router } from "express";

import { userRegitration } from "../controller/auth.controller";

const router: Router = express.Router();
router.post("/user-registration", userRegitration);
export default router;
