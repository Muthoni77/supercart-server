import express, { Router } from "express";
import {
  fetchProfile,
  updateProfile,
  updateProfilePhoto,
} from "../controllers/Profile";
import JWTGuard from "../guards/JWTGuard";
import uploader from "../utils/multer";
const router: Router = express.Router();

router.get("/", JWTGuard, fetchProfile);
router.post("/update", JWTGuard, updateProfile);
router.post(
  "/update-photo",
  JWTGuard,
  uploader.single("file"),
  updateProfilePhoto
);

export default router;
