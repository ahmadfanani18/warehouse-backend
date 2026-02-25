import { Router } from 'express';

const router = Router();

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
router.get('/', (req, res) => {
  res.status(200).json({ message: 'List Inventory Route (wip)' });
});

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
router.get('/:sku', (req, res) => {
  res.status(200).json({ message: 'Inventory Detail Route (wip)' });
});

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
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create Inventory Route (wip)' });
});

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
router.put('/:sku', (req, res) => {
  res.status(200).json({ message: 'Update Inventory Route (wip)' });
});

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
router.delete('/:sku', (req, res) => {
  res.status(200).json({ message: 'Delete Inventory Route (wip)' });
});

export default router;
