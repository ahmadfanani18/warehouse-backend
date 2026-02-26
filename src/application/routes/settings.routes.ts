import { Router } from 'express';
import { container } from 'tsyringe';
import { SettingsController } from '../controllers/SettingsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const settingsController = container.resolve(SettingsController);

// Require SUPER_ADMIN for all settings changes
const requireAdmin = roleMiddleware([Role.SUPER_ADMIN]);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System Settings API (Categories, Units)
 */

// --- CATEGORIES ---

/**
 * @swagger
 * /api/settings/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a new category
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.get('/categories', authMiddleware, requireAdmin, settingsController.getCategories);
router.post('/categories', authMiddleware, requireAdmin, settingsController.createCategory);

/**
 * @swagger
 * /api/settings/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Settings]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete a category
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
 *         description: Category deleted successfully
 */
router.put('/categories/:id', authMiddleware, requireAdmin, settingsController.updateCategory);
router.delete('/categories/:id', authMiddleware, requireAdmin, settingsController.deleteCategory);

// --- UNITS ---

/**
 * @swagger
 * /api/settings/units:
 *   get:
 *     summary: Get all units
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of units
 *   post:
 *     summary: Create a new unit
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, abbreviation]
 *             properties:
 *               name:
 *                 type: string
 *               abbreviation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unit created successfully
 */
router.get('/units', authMiddleware, requireAdmin, settingsController.getUnits);
router.post('/units', authMiddleware, requireAdmin, settingsController.createUnit);

/**
 * @swagger
 * /api/settings/units/{id}:
 *   put:
 *     summary: Update a unit
 *     tags: [Settings]
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
 *               abbreviation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *   delete:
 *     summary: Delete a unit
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
 *         description: Unit deleted successfully
 */
router.put('/units/:id', authMiddleware, requireAdmin, settingsController.updateUnit);
router.delete('/units/:id', authMiddleware, requireAdmin, settingsController.deleteUnit);

export default router;
