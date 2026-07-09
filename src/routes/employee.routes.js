import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    getEmployees,
    getEmployeeById,
} from "../controllers/employee.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

export default router;