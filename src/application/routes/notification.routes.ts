import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: In-App Notifications API
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: List notifikasi untuk user (Paginated)
 *     tags: [Notification]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Paginated notifications
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'List Notifications Route (wip)' });
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Tandai 1 notifikasi sudah dibaca
 *     tags: [Notification]
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
 *         description: Notification marked as read
 */
router.put('/:id/read', (req, res) => {
  res.status(200).json({ message: 'Mark Notification Read Route (wip)' });
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Tandai semua notifikasi sudah dibaca
 *     tags: [Notification]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', (req, res) => {
  res.status(200).json({ message: 'Mark All Notifications Read Route (wip)' });
});

export default router;
