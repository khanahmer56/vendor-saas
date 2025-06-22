import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/product.routes";
const host = process.env.HOST ?? "localhost";
const port = 6002;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send({ message: "Hello AP22I" });
});
app.use("/api", router);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get("/docs-json", (req, res) => {
//   res.json(swaggerDocument);
// });

const server = app.listen(port, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log("Swagger UI: http://localhost:6002/api-docs");
  console.log("Swagger JSON: http://localhost:6002/docs-json");
});
server.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
