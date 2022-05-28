import express from "express";
import * as authenticationController from "../controllers/authentication.js";

const router = express.Router();

router.post("/signin", authenticationController.signin);
router.post("/signup", authenticationController.signup);
router.get("/logout", authenticationController.logout);

export default router;
