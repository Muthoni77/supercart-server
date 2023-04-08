import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import {
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  requestResetPassword,
  resetPassword,
} from "../controllers/Auth";
import JWTGuard from "../guards/JWTGuard";
import JWTRefreshGuard from "../guards/JWTRefreshGuard";
import JWTResetGuard from "../guards/JWTResetGuard";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", JWTGuard, logout);
router.get("/refresh-token", JWTRefreshGuard, refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password",JWTResetGuard, resetPassword);
export default router;
