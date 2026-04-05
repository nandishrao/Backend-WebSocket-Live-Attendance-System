import { Router } from "express";

const router = Router;

router.post('/login', validateSchema(LogInSchema), authController.login);