import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import LoginHistory from "../models/loginHistory.model.js";

/* =========================
   GET EMPLOYEES
========================= */
export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const where = {};

    if (department) where.department = department;

    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

/* =========================
   CREATE EMPLOYEE
========================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      bio,
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      role: role || "EMPLOYEE",
    });

    const employee = await Employee.create({
      userId: user._id,
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      bio,
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
};

/* =========================
   UPDATE EMPLOYEE
========================= */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

/* =========================
   DELETE EMPLOYEE
========================= */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const emp = await Employee.findById(id);

    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    emp.isDeleted = true;
    emp.employmentStatus = "INACTIVE";

    await emp.save();

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};

/* =========================
   HISTORY API (FINAL FIX)
========================= */
export const getEmployeeHistory = async (req, res) => {
  try {
    console.log("🔥 HISTORY API HIT");

    const { id } = req.params;

    console.log("Employee ID:", id);

    const history = await LoginHistory.find({ employeeId: id })
      .sort({ createdAt: -1 })
      .lean();

    console.log("History count:", history.length);

    return res.json(history);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
