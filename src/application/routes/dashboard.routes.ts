import { Router } from "express";
import { container } from "tsyringe";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const dashboardController = container.resolve(DashboardController);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard metrics and activities
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary metrics
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
router.get("/summary", dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard/activities:
 *   get:
 *     summary: Get recent warehouse activities
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of recent activities
 */
router.get("/activities", dashboardController.getActivities);

export default router;
