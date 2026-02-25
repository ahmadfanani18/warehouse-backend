import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Warehouse
 *   description: Warehouse Management API
 */

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: List semua gudang
 *     tags: [Warehouse]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil list gudang
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'List Warehouses Route (wip)' });
});

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Buat master gudang baru (Super Admin)
 *     tags: [Warehouse]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               managerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gudang berhasil dibuat
 */
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create Warehouse Route (wip)' });
});

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Update data master gudang
 *     tags: [Warehouse]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               managerId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Gudang berhasil diupdate
 */
router.put('/:id', (req, res) => {
  res.status(200).json({ message: 'Update Warehouse Route (wip)' });
});

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Soft delete master gudang
 *     tags: [Warehouse]
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
 *         description: Gudang berhasil dinonaktifkan
 */
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Delete Warehouse Route (wip)' });
});

export default router;
