import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { customErrorType } from "../Types/Error";

const errorHandler = (
  err: customErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  res.json({
    success: false,
    status: statusCode,
    error: errorMessage,
  });
};

export default errorHandler;
