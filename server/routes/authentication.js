import express from "express";
import * as authenticationController from "../controllers/authentication.js";

const router = express.Router();

// 로그인
router.post("/signin", authenticationController.signin);
// 로그인 쿠키 이용
router.post("/signin1", authenticationController.signin1);

// 로그 아웃
router.get("/logout", authenticationController.logout);
router.get("/logout1", authenticationController.logout1);

export default router;
