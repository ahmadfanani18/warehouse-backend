import { Router } from 'express';
import { container } from 'tsyringe';
import { WarehouseController } from '../controllers/WarehouseController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const warehouseController = container.resolve(WarehouseController);

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
 *     summary: Dapatkan daftar semua gudang
 *     tags: [Warehouse]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar gudang
 */
router.get('/', authMiddleware, warehouseController.getWarehouses);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Tambah gudang baru
 *     tags: [Warehouse]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Gudang berhasil ditambahkan
 */
router.post('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), warehouseController.createWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Update data gudang
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
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Gudang berhasil diupdate
 */
router.put('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), warehouseController.updateWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Nonaktifkan gudang
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
router.delete('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), warehouseController.deleteWarehouse);

export default router;
