import express, { Router, Request, Response, NextFunction } from "express";
import { sendEmailActivation } from "../utils/sendEmail";

const router: Router = express.Router();

router.get(
  "/email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailSent = await sendEmailActivation({
        token: "testtoken",
        recipientName: "Jane Doe",
        recipientEmail: "test@gmail.com",
      });
      if (emailSent) {
        res.status(200).json({ success: true, message: "Email sent" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Failed to send email" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
