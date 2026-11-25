import express from "express";
import { getEmployeeHistory } from "../controllers/loginHistory.controller.js";
const router = express.Router();
router.get("/employees/:id/history", getEmployeeHistory);

export default router;
