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
  resendOTP,
  verifyOTP,
  requestVerifyEmail,
} from "../controllers/Auth";
import JWTGuard from "../guards/JWTGuard";
import JWTRefreshGuard from "../guards/JWTRefreshGuard";
import JWTResetGuard from "../guards/JWTResetGuard";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", JWTGuard, logout);
router.get("/refresh-token", JWTRefreshGuard, refreshToken);
router.post("/request-verify-email", requestVerifyEmail);
router.get("/verify-email/:token", verifyEmail);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", JWTResetGuard, resetPassword);
router.get("/resend-otp", JWTGuard, resendOTP);
router.post("/verify-otp", JWTGuard, verifyOTP);
export default router;
