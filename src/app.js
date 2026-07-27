import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import { csrfMiddleware } from "./middleware/csrf.js";
import { readDB } from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  }),
);

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(csrfMiddleware);

app.use("/auth", authRoutes);

app.use("/employees", employeeRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Employee Backend Running",
  });
});

app.get("/db", async (req, res) => {
  const db = await readDB();

  res.json(db);
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
