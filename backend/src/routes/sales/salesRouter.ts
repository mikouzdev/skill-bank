import { Router } from "express";
import { offersRouter } from "./offersRouter.js";
import { salesListRouter } from "./salesListRouter.js";

export const salesRouter = Router();

salesRouter.use("/", offersRouter);
salesRouter.use("/", salesListRouter);