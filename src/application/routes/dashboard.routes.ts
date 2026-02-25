import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard Analytics & Summary API
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Ambil data ringkasan dashboard
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: Filter ringkasan berdasarkan Gudang tertentu (Opsional untuk Super Admin)
 *     responses:
 *       200:
 *         description: Berhasil mengambil data summary
 */
router.get('/summary', (req, res) => {
  res.status(200).json({ message: 'Dashboard Summary Route (wip)' });
});

/**
 * @swagger
 * /api/dashboard/activities:
 *   get:
 *     summary: Ambil data log aktivitas terbaru
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil log aktivitas
 */
router.get('/activities', (req, res) => {
  res.status(200).json({ message: 'Dashboard Activities Route (wip)' });
});

export default router;
