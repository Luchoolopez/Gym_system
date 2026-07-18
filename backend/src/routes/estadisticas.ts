import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";
import { StatsService } from "../services/stats.service";
import { authenticateToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const statsRouter = Router();
const statsService = new StatsService();
const statsController = new StatsController(statsService);

statsRouter.get('/mias', authenticateToken, statsController.getMias);
statsRouter.get('/dashboard', authenticateToken, isAdmin, statsController.getDashboard);

export default statsRouter;
export { statsRouter as router };
