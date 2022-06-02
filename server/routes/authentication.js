import express from "express";
import * as authenticationController from "../controllers/authentication.js";

const router = express.Router();

// 로그인
router.post("/signin", authenticationController.signin);
// 로그 아웃
router.get("/logout", authenticationController.logout);

export default router;
