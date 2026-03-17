import express from "express";
import { consultantsRootRouter } from "./routes/consultants/consultantsRootRouter.js";
import { usersRouter } from "./routes/auth/usersRouter.js";
import { adminRouter } from "./routes/admin/adminRouter.js";
import { salesRouter } from "./routes/sales/salesRouter.js";
import { skillsRouter } from "./routes/skills/skillsRouter.js";
import { commentsRouter } from "./routes/comments/commentsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: move profile pictures to Azure blob storage
app.use("/static", express.static("uploads/profile_pictures"));
app.use("/api/consultants", consultantsRootRouter);
app.use("/api/auth", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/sales", salesRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/comments", commentsRouter);

app.use(errorHandler);

export default app;
