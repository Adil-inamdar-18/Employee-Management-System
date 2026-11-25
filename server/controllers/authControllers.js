import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoginHistory from "../models/loginHistory.model.js";

// LOGIN
// POST /api/auth/login

export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // ROLE CHECK
    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({
        error: "Not authorised as admin",
      });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({
        error: "Not authorised as employee",
      });
    }

    // PASSWORD CHECK
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // JWT PAYLOAD
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    // TOKEN
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // SAVE LOGIN HISTORY
    await LoginHistory.create({
      employeeId: user._id,
      loginTime: new Date(),
      ipAddress: req.ip || req.headers["x-forwarded-for"],
      device: req.headers["user-agent"],
      status: "Login",
    });

    return res.status(200).json({
      success: true,
      user: payload,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};

// SESSION
// GET /api/auth/session

export const session = (req, res) => {
  return res.json({
    user: req.session,
  });
};

// CHANGE PASSWORD
// POST /api/auth/change-password

export const changePassword = async (req, res) => {
  try {
    const session = req.session;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Both passwords are required",
      });
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(session.userId, {
      password: hashed,
    });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to change password",
    });
  }
};

// LOGOUT
// POST /api/auth/logout

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SAVE LOGOUT HISTORY
    await LoginHistory.create({
      employeeId: decoded.userId,
      logoutTime: new Date(),
      ipAddress: req.ip || req.headers["x-forwarded-for"],
      device: req.headers["user-agent"],
      status: "Logout",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Logout failed",
    });
  }
};
