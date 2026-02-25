import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System Settings (Categories, Units, General) API
 */

// --- Categories --- //

/**
 * @swagger
 * /api/settings/categories:
 *   get:
 *     summary: Ambil daftar kategori barang
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List categories
 */
router.get('/categories', (req, res) => {
  res.status(200).json({ message: 'List Categories Route (wip)' });
});

/**
 * @swagger
 * /api/settings/categories:
 *   post:
 *     summary: Buat kategori barang baru
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori dibuat
 */
router.post('/categories', (req, res) => {
  res.status(201).json({ message: 'Create Category Route (wip)' });
});

/**
 * @swagger
 * /api/settings/categories/{id}:
 *   put:
 *     summary: Update kategori barang
 *     tags: [Settings]
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
 *         description: Kategori diupdate
 */
router.put('/categories/:id', (req, res) => {
  res.status(200).json({ message: 'Update Category Route (wip)' });
});

/**
 * @swagger
 * /api/settings/categories/{id}:
 *   delete:
 *     summary: Hapus kategori barang
 *     tags: [Settings]
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
 *         description: Kategori dihapus
 */
router.delete('/categories/:id', (req, res) => {
  res.status(200).json({ message: 'Delete Category Route (wip)' });
});

// --- Units --- //

/**
 * @swagger
 * /api/settings/units:
 *   get:
 *     summary: Ambil daftar satuan (unit) barang
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List units
 */
router.get('/units', (req, res) => {
  res.status(200).json({ message: 'List Units Route (wip)' });
});

/**
 * @swagger
 * /api/settings/units:
 *   post:
 *     summary: Buat satuan barang baru
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Satuan dibuat
 */
router.post('/units', (req, res) => {
  res.status(201).json({ message: 'Create Unit Route (wip)' });
});

/**
 * @swagger
 * /api/settings/units/{id}:
 *   put:
 *     summary: Update satuan barang
 *     tags: [Settings]
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
 *         description: Satuan diupdate
 */
router.put('/units/:id', (req, res) => {
  res.status(200).json({ message: 'Update Unit Route (wip)' });
});

/**
 * @swagger
 * /api/settings/units/{id}:
 *   delete:
 *     summary: Hapus satuan barang
 *     tags: [Settings]
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
 *         description: Satuan dihapus
 */
router.delete('/units/:id', (req, res) => {
  res.status(200).json({ message: 'Delete Unit Route (wip)' });
});

// --- General Settings --- //

/**
 * @swagger
 * /api/settings/general:
 *   get:
 *     summary: Ambil pengaturan umum sistem
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Application settings returned
 */
router.get('/general', (req, res) => {
  res.status(200).json({ message: 'Get General Settings Route (wip)' });
});

/**
 * @swagger
 * /api/settings/general:
 *   put:
 *     summary: Update pengaturan umum sistem (Super Admin)
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               currency:
 *                 type: string
 *               timezone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/general', (req, res) => {
  res.status(200).json({ message: 'Update General Settings Route (wip)' });
});

export default router;
