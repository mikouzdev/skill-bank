import { Router, type Request, type Response } from "express";
import { offersRouter } from "./offersRouter.js";

export const salesRouter = Router();

salesRouter.use("/", offersRouter);