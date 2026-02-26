import { Router } from 'express';
import { container } from 'tsyringe';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();
const transactionController = container.resolve(TransactionController);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Stock Transactions API
 */

/**
 * @swagger
 * /api/transactions/stock-in:
 *   post:
 *     summary: Buat transaksi barang masuk (Stock In)
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - items
 *             properties:
 *               warehouseId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               referenceNo:
 *                 type: string
 *               supplier:
 *                 type: string
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Transaksi berhasil disimpan
 */
// Stock In => Semua role
router.post('/stock-in', transactionController.createStockIn);

/**
 * @swagger
 * /api/transactions/stock-out:
 *   post:
 *     summary: Buat transaksi barang keluar (Stock Out)
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - items
 *             properties:
 *               warehouseId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               referenceNo:
 *                 type: string
 *               destination:
 *                 type: string
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Transaksi berhasil disimpan
 */
// Stock Out => Semua role
router.post('/stock-out', transactionController.createStockOut);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Buat permintaan transfer stok antar gudang
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceWarehouseId
 *               - targetWarehouseId
 *               - items
 *             properties:
 *               sourceWarehouseId:
 *                 type: string
 *               targetWarehouseId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Permintaan transfer berhasil dibuat
 */
// Transfer => SUPER_ADMIN, WH_MANAGER
router.post('/transfer', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), transactionController.createTransfer);

/**
 * @swagger
 * /api/transactions/transfer/pending:
 *   get:
 *     summary: Ambil daftar transfer stok yang menunggu persetujuan
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List pending transfers
 */
// Pending Transfers => WH_MANAGER (untuk gudang tujuan juga SA)
router.get('/transfer/pending', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), transactionController.getPendingTransfers);

/**
 * @swagger
 * /api/transactions/transfer/{id}/approve:
 *   put:
 *     summary: Setujui permintaan transfer stok
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer disetujui
 */
// Approve Transfer => WH_MANAGER
router.put('/transfer/:id/approve', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), transactionController.approveTransfer);

/**
 * @swagger
 * /api/transactions/transfer/{id}/reject:
 *   put:
 *     summary: Tolak permintaan transfer stok
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer ditolak
 */
// Reject Transfer => WH_MANAGER
router.put('/transfer/:id/reject', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), transactionController.rejectTransfer);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Lihat riwayat semua transaksi
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *       - in: query
 *         name: warehouseId
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Transaction history list
 */
// History => Semua Role (pembatasan dilakukan di level user ID nanti)
router.get('/history', transactionController.getHistory);

export default router;
