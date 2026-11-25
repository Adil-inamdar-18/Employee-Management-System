import mongoose from "mongoose";
const loginHistorySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    loginTime: Date,

    logoutTime: Date,

    ipAddress: String,

    device: String,

    status: String,
  },
  {
    timestamps: true,
  },
);

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

export default LoginHistory;
