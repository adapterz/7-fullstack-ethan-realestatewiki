import express from "express";
import * as aptTransactionController from "../controllers/apt_transaction.js";

const router = express.Router();

// 아파트 거래 내역 조회(by 아파트 이름, 법정동)
router.get("/", aptTransactionController.getAptTranactionListByAptNameAndDong);

export default router;
