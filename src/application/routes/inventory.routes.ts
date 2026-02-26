import { Router } from 'express';
import { container } from 'tsyringe';
import { InventoryController } from '../controllers/InventoryController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();
const inventoryController = container.resolve(InventoryController);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory Management API
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: List semua inventory/produk
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Paginated inventory list
 */
router.get('/', inventoryController.getInventories);

/**
 * @swagger
 * /api/inventory/{sku}:
 *   get:
 *     summary: Detail sebuah produk berdasarkan SKU
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory details
 */
router.get('/:sku', inventoryController.getProductDetail);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create produk baru (Super Admin / WH Manager)
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - name
 *               - categoryId
 *             properties:
 *               sku:
 *                 type: string
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item inventory berhasil dibuat
 */
router.post('/', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), inventoryController.createProduct);

/**
 * @swagger
 * /api/inventory/{sku}:
 *   put:
 *     summary: Edit produk inventory
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item inventory berhasil diubah
 */
router.put('/:sku', authorizeRoles(Role.SUPER_ADMIN, Role.WH_MANAGER), inventoryController.updateProduct);

/**
 * @swagger
 * /api/inventory/{sku}:
 *   delete:
 *     summary: Hapus produk inventory
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item inventory berhasil dihapus
 */
router.delete('/:sku', authorizeRoles(Role.SUPER_ADMIN), inventoryController.deleteProduct);

export default router;
