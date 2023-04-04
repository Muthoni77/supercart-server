import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import { login, register } from "../controllers/Auth";

router.post("/login", login);
router.post("/register", register);

export default router;
