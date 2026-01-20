import { Router } from "express";
import { consultantsRouter } from "./consultantsRouter.js";
import { employmentsRouter } from "./employmentsRouter.js";
import { projectsRouter } from "./projectsRouter.js";
import { skillsRouter } from "./skillsRouter.js";
import { attributesRouter } from "./attributesRouter.js";
import { pageSectionsRouter } from "./pageSectionsRouter.js";

export const consultantsRootRouter = Router();

consultantsRootRouter.use("/", consultantsRouter);
consultantsRootRouter.use("/", employmentsRouter); // /employments
consultantsRootRouter.use("/", projectsRouter); // /projects
consultantsRootRouter.use("/", attributesRouter); //attributes
consultantsRootRouter.use("/", skillsRouter); //skills
consultantsRootRouter.use("/", pageSectionsRouter); //sections
