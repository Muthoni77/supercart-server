import express, { Application, Request, Response, NextFunction } from "express";
const app: Application = express();
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/ErrorHandler";
import connectToDB from "./config/ConnectToDB";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
import AuthRoutes from "./Routes/AuthRoutes";
import mongoose, { mongo } from "mongoose";

const PORT = process.env.PORT;

connectToDB();

app.get("/", (req: Request, res: Response): void => {
  res.send(
    "<h1>Welcome to Supercart Server</h1> <a href='http://localhost:3000'>Kindly checkout our application</a>"
  );
});
app.use("/auth", AuthRoutes);

//Error handling middleware
app.use(errorHandler);

mongoose.connection.on("open", () => {
  app.listen(PORT, (): void => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
