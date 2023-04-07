import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import {
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
} from "../controllers/Auth";
import JWTGuard from "../guards/JWTGuard";
import JWTRefreshGuard from "../guards/JWTRefreshGuard";

router.post("/login", login);
router.post("/register", register);
router.get("/logout", JWTGuard, logout);
router.get("/refresh-token", JWTRefreshGuard, refreshToken);
router.get("/verify-email/:id", verifyEmail);

export default router;
