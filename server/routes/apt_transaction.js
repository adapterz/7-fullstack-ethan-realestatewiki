import express from "express";
import * as aptTransactionController from "../controllers/apt_transaction.js";
import { getIpAndMoment } from "../middlewares/console.js";
import limiter from "../middlewares/ratelimit.js";

const router = express.Router();

// 아파트 거래 내역 조회(by 아파트 이름, 법정동)
router.get(
  "/",
  limiter,
  getIpAndMoment,
  aptTransactionController.getAptTranactionListByAptNameAndDong
);

export default router;
