import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting & Analytics API
 */

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Laporan pergerakan stok
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *       - in: query
 *         name: startDate
 *       - in: query
 *         name: endDate
 *       - in: query
 *         name: category
 *     responses:
 *       200:
 *         description: Laporan stok success
 */
router.get('/stock', (req, res) => {
  res.status(200).json({ message: 'Stock Report Route (wip)' });
});

/**
 * @swagger
 * /api/reports/financial:
 *   get:
 *     summary: Laporan keuangan (valuasi stok, HPP)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *       - in: query
 *         name: startDate
 *       - in: query
 *         name: endDate
 *     responses:
 *       200:
 *         description: Laporan keuangan success
 */
router.get('/financial', (req, res) => {
  res.status(200).json({ message: 'Financial Report Route (wip)' });
});

/**
 * @swagger
 * /api/reports/expenditure:
 *   get:
 *     summary: Laporan pengeluaran / losses
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *       - in: query
 *         name: startDate
 *       - in: query
 *         name: endDate
 *     responses:
 *       200:
 *         description: Laporan pengeluaran success
 */
router.get('/expenditure', (req, res) => {
  res.status(200).json({ message: 'Expenditure Report Route (wip)' });
});

/**
 * @swagger
 * /api/reports/{type}/export:
 *   get:
 *     summary: Export laporan ke .xlsx atau .csv
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stock, financial, expenditure]
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [xlsx, csv]
 *           default: xlsx
 *     responses:
 *       200:
 *         description: File format octet-stream
 */
router.get('/:type/export', (req, res) => {
  res.status(200).json({ message: 'Export Report Route (wip)' });
});

export default router;
