import { readDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import express from "express";
import cors from "cors";

import morgan from "morgan";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

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

export default app;