import express from "express";
import { consultantsRootRouter } from "./routes/consultants/consultantsRootRouter.js";
import { skillsRouter } from "./routes/consultants/skillsRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: move profile pictures to Azure blob storage
app.use("/static", express.static("uploads/profile_pictures"));
app.use("/consultants", consultantsRootRouter);

export default app;
