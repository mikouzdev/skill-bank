import express from "express";
import { consultantsRootRouter } from "./routes/consultants/consultantsRootRouter.js";
import { usersRouter } from "./routes/auth/usersRouter.js";
import { adminRouter } from "./routes/admin/adminRouter.js";
import { skillsRouter } from "./routes/skills/skillsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: move profile pictures to Azure blob storage
app.use("/static", express.static("uploads/profile_pictures"));
app.use("/consultants", consultantsRootRouter);
app.use("/auth", usersRouter);
app.use("/admin", adminRouter);
app.use("/skills", skillsRouter);

app.use(errorHandler);

export default app;
