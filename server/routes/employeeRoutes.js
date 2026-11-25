import { Router } from "express";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  getEmployeeHistory,
} from "../controllers/employeeControllers.js";

import { protect, protectAdmin } from "../middleware/auth.js";

const employeesRouter = Router();

/* =========================
   EMPLOYEES CRUD
========================= */
employeesRouter.get("/", protect, protectAdmin, getEmployees);

employeesRouter.post("/", protect, protectAdmin, createEmployee);

employeesRouter.put("/:id", protect, protectAdmin, updateEmployee);

employeesRouter.delete("/:id", protect, protectAdmin, deleteEmployee);

/* =========================
   HISTORY ROUTE (FIXED)
   IMPORTANT: place BEFORE generic routes if needed
========================= */
employeesRouter.get("/:id/history", protect, protectAdmin, getEmployeeHistory);

export default employeesRouter;
