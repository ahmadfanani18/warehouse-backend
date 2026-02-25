import { Router } from 'express';
// import { authController } from '../controllers/AuthController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login into the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login Route (wip)' });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from the system
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil logout
 */
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout Route (wip)' });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Berhasil refresh token
 */
router.post('/refresh', (req, res) => {
  res.status(200).json({ message: 'Refresh Route (wip)' });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', (req, res) => {
  res.status(200).json({ message: 'Me Route (wip)' });
});

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Ubah password user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Password lama salah
 */
router.put('/change-password', (req, res) => {
  res.status(200).json({ message: 'Change Password Route (wip)' });
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request link reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instruksi pemulihan telah dikirim
 */
router.post('/forgot-password', (req, res) => {
  res.status(200).json({ message: 'Forgot Password Route (wip)' });
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Eksekusi reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil di-reset
 *       400:
 *         description: Token invalid / expired
 */
router.post('/reset-password', (req, res) => {
  res.status(200).json({ message: 'Reset Password Route (wip)' });
});

export default router;
