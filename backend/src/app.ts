import express from "express";
import { consultantsRootRouter } from "./routes/consultants/consultantsRootRouter.js";
import { usersRouter } from "./routes/auth/usersRouter.js";
import { adminRouter } from "./routes/admin/adminRouter.js";
import { salesRouter } from "./routes/sales/salesRouter.js";
import { skillsRouter } from "./routes/skills/skillsRouter.js";
import { commentsRouter } from "./routes/comments/commentsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "https://spankki.azurewebsites.net", // production Azure URL
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: move profile pictures to Azure blob storage
app.use("/static", express.static("uploads/profile_pictures"));
app.use("/consultants", consultantsRootRouter);
app.use("/auth", usersRouter);
app.use("/admin", adminRouter);
app.use("/sales", salesRouter);
app.use("/skills", skillsRouter);
app.use("/comments", commentsRouter);

app.use(errorHandler);
app.use(express.static("dist"));

export default app;
