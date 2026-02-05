import { Router } from "express";
import { offersRouter } from "./offersRouter.js";

export const salesRouter = Router();

salesRouter.use("/", offersRouter);