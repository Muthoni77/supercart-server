import Express, { Router } from "express";
import { handleMpesaCheckout } from "../../../controllers/Payments/mpesa";
import JWTGuard from "../../../guards/JWTGuard";
const router: Router = Express.Router();

router.post("/checkout", JWTGuard, handleMpesaCheckout);

export default router;
