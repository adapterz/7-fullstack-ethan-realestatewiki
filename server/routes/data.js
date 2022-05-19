import express from "express";
import * as fs from "node:fs";
import * as dataController from "../controllers/data.js";

const router = express.Router();

router.get("/", dataController.showData);
router.post("/", dataController.makeNewData);
router.put("/:id", dataController.changeAllData);
router.delete("/:id", dataController.deleteData);
router.patch("/:id", dataController.patchData);

export default router;
