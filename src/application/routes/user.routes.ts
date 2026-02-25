import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management and Profile API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List semua user (Super Admin only)
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated user list
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'List Users Route (wip)' });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Buat user baru (Super Admin only)
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, WH_MANAGER, STAFF]
 *               warehouseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 */
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create User Route (wip)' });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update data user (Super Admin only)
 *     tags: [User]
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
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               warehouseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 */
router.put('/:id', (req, res) => {
  res.status(200).json({ message: 'Update User Route (wip)' });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete user (Super Admin only)
 *     tags: [User]
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
 *         description: User berhasil dinonaktifkan
 */
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Delete User Route (wip)' });
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile details
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', (req, res) => {
  res.status(200).json({ message: 'My Profile Route (wip)' });
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profile info
 *     tags: [User]
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
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', (req, res) => {
  res.status(200).json({ message: 'Update My Profile Route (wip)' });
});

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload/Update avatar
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated
 */
router.post('/avatar', (req, res) => {
  res.status(200).json({ message: 'Upload Avatar Route (wip)' });
});

export default router;
