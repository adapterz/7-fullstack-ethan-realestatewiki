import express from "express";
import * as aptTransactionController from "../controllers/apt_transaction.js";

const router = express.Router();

router.get("/", aptTransactionController.getAptTranactionListByAptName);

export default router;
