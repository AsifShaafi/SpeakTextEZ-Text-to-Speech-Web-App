import express, { json, raw, urlencoded } from "express";
import { registerRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler";
import cors from "cors";
import { config } from "./config";

const app = express();

app.use(cors({ origin: config.corsOrigin }));

app.use(json());
app.use(raw());
app.use(urlencoded({ extended: true }));

app.get("/readiness_check", (req, res) => res.sendStatus(200));

registerRoutes(app);

app.use(errorHandler());

export { app };
