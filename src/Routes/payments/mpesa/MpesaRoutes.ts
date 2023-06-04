import Express, { Router } from "express";
import {
  handleMpesaCheckout,
  handleMpesaCallback,
} from "../../../controllers/Payments/mpesa";
import JWTGuard from "../../../guards/JWTGuard";
const router: Router = Express.Router();

router.post("/checkout", JWTGuard, handleMpesaCheckout);
router.post("/callback", handleMpesaCallback);

export default router;
