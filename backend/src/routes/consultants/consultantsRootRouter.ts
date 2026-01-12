import { Router } from "express";
import { consultantsRouter } from "./consultantsRouter.js";
import { employmentsRouter } from "./employmentsRouter.js";
import { projectsRouter } from "./projectsRouter.js";
import { skillsRouter } from "./skillsRouter.js";

export const consultantsRootRouter = Router();

consultantsRootRouter.use("/", consultantsRouter);
consultantsRootRouter.use("/", employmentsRouter);
consultantsRootRouter.use("/", projectsRouter);
consultantsRootRouter.use("/skills", skillsRouter);
