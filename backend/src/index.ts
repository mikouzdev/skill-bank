import app from "./app.js";
import swaggerUi from "swagger-ui-express";
import { openApiDoc } from "./openapi/openapi.js";

const PORT = Number(process.env.PORT) || 3000;

app.get("/openapi.json", (req, res) => {
  res.json(openApiDoc);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
