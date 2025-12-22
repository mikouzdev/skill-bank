import { Router } from "express";
import { consultantsRouter } from "./consultantsRouter.js";
import { employmentsRouter } from "./employmentsRouter.js";
import { projectsRouter } from "./projectsRouter.js";

export const consultantsRootRouter = Router();

consultantsRootRouter.use("/", consultantsRouter);
consultantsRootRouter.use("/", employmentsRouter);
consultantsRootRouter.use("/", projectsRouter);
//consultantsRootRouter.use("/", skillsRouter)
