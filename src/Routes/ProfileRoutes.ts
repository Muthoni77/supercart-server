import express, { Router } from "express";
import { fetchProfile, updateProfile } from "../controllers/Profile";
import JWTGuard from "../guards/JWTGuard";
const router: Router = express.Router();

router.get("/", JWTGuard, fetchProfile);
router.post("/update", JWTGuard, updateProfile);

export default router;
