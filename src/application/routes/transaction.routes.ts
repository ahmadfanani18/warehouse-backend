import { Router } from 'express';

const router = Router();

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
 *               - date
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
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     location:
 *                       type: string
 *     responses:
 *       201:
 *         description: Transaksi berhasil disimpan
 */
router.post('/stock-in', (req, res) => {
  res.status(201).json({ message: 'Stock In Route (wip)' });
});

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
 *               - date
 *               - items
 *             properties:
 *               warehouseId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               referenceNo:
 *                 type: string
 *               recipient:
 *                 type: string
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Transaksi berhasil disimpan
 */
router.post('/stock-out', (req, res) => {
  res.status(201).json({ message: 'Stock Out Route (wip)' });
});

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
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Permintaan transfer berhasil dibuat
 */
router.post('/transfer', (req, res) => {
  res.status(201).json({ message: 'Stock Transfer Route (wip)' });
});

/**
 * @swagger
 * /api/transactions/transfer/pending:
 *   get:
 *     summary: Ambil daftar transfer stok yang menunggu persetujuan
 *     tags: [Transaction]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List pending transfers
 */
router.get('/transfer/pending', (req, res) => {
  res.status(200).json({ message: 'Pending Transfers Route (wip)' });
});

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
 *     responses:
 *       200:
 *         description: Transfer disetujui
 */
router.put('/transfer/:id/approve', (req, res) => {
  res.status(200).json({ message: 'Approve Transfer Route (wip)' });
});

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
router.put('/transfer/:id/reject', (req, res) => {
  res.status(200).json({ message: 'Reject Transfer Route (wip)' });
});

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
router.get('/history', (req, res) => {
  res.status(200).json({ message: 'Transaction History Route (wip)' });
});

export default router;
