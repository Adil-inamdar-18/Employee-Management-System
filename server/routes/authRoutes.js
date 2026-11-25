import { Router } from "express";

import {
  login,
  session,
  changePassword,
  logout,
} from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.get("/session", session);

authRouter.post("/change-password", changePassword);

authRouter.post("/logout", logout);

export default authRouter;
