import { Router } from "express";
import { consultantsRouter } from "./consultantsRouter.js";
import { employmentsRouter } from "./employmentsRouter.js";
import { projectsRouter } from "./projectsRouter.js";
import { skillsRouter } from "./skillsRouter.js";
import { attributesRouter } from "./attributesRouter.js";
import { pageSectionsRouter } from "./pageSectionsRouter.js";

export const consultantsRootRouter = Router();

consultantsRootRouter.use("/", consultantsRouter);
consultantsRootRouter.use("/employments", employmentsRouter);
consultantsRootRouter.use("/projects", projectsRouter);
consultantsRootRouter.use("/attributes", attributesRouter);
consultantsRootRouter.use("/skills", skillsRouter);
consultantsRootRouter.use("/sections", pageSectionsRouter);
