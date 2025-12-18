import express from "express";
import { consultantsRouter } from "./routes/consultantsRouter.js";
import { skillsRouter } from "./routes/skillsRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: move profile pictures to Azure blob storage
app.use("/static", express.static("uploads/profile_pictures"));
app.use("/consultants", consultantsRouter);
//app.use("/skill", skillsRouter);

export default app;
