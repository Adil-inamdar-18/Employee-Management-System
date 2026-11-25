import LoginHistory from "../models/loginHistory.model.js";

export const getEmployeeHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({
      employeeId: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
