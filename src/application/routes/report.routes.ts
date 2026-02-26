import { Router } from 'express';
import { container } from 'tsyringe';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();
const reportController = container.resolve(ReportController);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Warehouse Reports
 */

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Get overall stock report
 *     tags: [Report]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Stock report details
 */
// Stock Report => SUPER_ADMIN & WH_MANAGER
router.get('/stock', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), reportController.getStockReport);

/**
 * @swagger
 * /api/reports/financial:
 *   get:
 *     summary: Get financial report based on inventory value
 *     tags: [Report]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Financial report details
 */
// Financial Report => SUPER_ADMIN
router.get('/financial', authorizeRoles(Role.SUPER_ADMIN), reportController.getFinancialReport);

/**
 * @swagger
 * /api/reports/expenditure:
 *   get:
 *     summary: Get expenditure report
 *     tags: [Report]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Expenditure report details
 */
// Expenditure Report => SUPER_ADMIN
router.get('/expenditure', authorizeRoles(Role.SUPER_ADMIN), reportController.getExpenditureReport);

export default router;
