import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { login, register, logout } from "../controllers/Auth";
import JWTGuard from "../guards/JWTGuard";

router.post("/login", login);
router.post("/register", register);
router.get("/logout",JWTGuard, logout);

export default router;
