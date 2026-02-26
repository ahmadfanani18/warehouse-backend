import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app'; // Your express app
import { prisma, truncateDB } from './setup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth API E2E', () => {
  const tUser = {
    email: 'testauth@example.com',
    password: 'password123',
    name: 'Auth Test User'
  };

  beforeAll(async () => {
    // Clean up DB before running the entire auth test suite
    await truncateDB();

    // Seed initial user for testing login
    const hashedPassword = await bcrypt.hash(tUser.password, 10);
    await prisma.user.create({
      data: {
        email: tUser.email,
        password: hashedPassword,
        name: tUser.name,
        role: 'STAFF',
        isActive: true
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and set cookie on valid credentials (Happy Path)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: tUser.email,
          password: tUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(tUser.email);
      
      // Check for set-cookie header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('access_token=');
    });

    it('should return 401 on invalid password (Unhappy Path)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: tUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 on validating missing input body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: tUser.email
        });

      expect(res.status).toBe(400); // Bad request because password is missing
    });
  });

  describe('GET /api/auth/me', () => {
    let authCookie: string;

    beforeAll(async () => {
      // Need to re-seed if the truncate hook runs (but we are in the same file so afterEach might wipe it unless we use afterAll in setup)
      // Note: setup.ts uses afterEach! Let's re-seed here just to be safe if tests run isolated
      const count = await prisma.user.count({ where: { email: tUser.email } });
      if (count === 0) {
        const hashedPassword = await bcrypt.hash(tUser.password, 10);
        await prisma.user.create({
          data: { email: tUser.email, password: hashedPassword, name: tUser.name, role: 'STAFF', isActive: true }
        });
      }

      // Setup: obtain valid cookie
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: tUser.email, password: tUser.password });
      authCookie = res.headers['set-cookie'][0];
    });

    it('should return user profile on valid cookie (Happy Path)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(tUser.email);
      expect(res.body.user.role).toBe('STAFF');
    });

    it('should return 401 without cookie (Unhappy Path)', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    let authCookie: string;

    beforeAll(async () => {
      const count = await prisma.user.count({ where: { email: tUser.email } });
      if (count === 0) {
        const hashedPassword = await bcrypt.hash(tUser.password, 10);
        await prisma.user.create({
          data: { email: tUser.email, password: hashedPassword, name: tUser.name, role: 'STAFF', isActive: true }
        });
      }

      // Setup: obtain valid cookie
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: tUser.email, password: tUser.password });
        
      authCookie = res.headers['set-cookie'][0];
    });

    it('should clear cookies and return 200', async () => {
       const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/access_token=;/); 
    });
  });
  describe('PUT /api/auth/change-password', () => {
    let authCookie: string;

    beforeAll(async () => {
      const count = await prisma.user.count({ where: { email: tUser.email } });
      if (count === 0) {
        const hashedPassword = await bcrypt.hash(tUser.password, 10);
        await prisma.user.create({
          data: { email: tUser.email, password: hashedPassword, name: tUser.name, role: 'STAFF', isActive: true }
        });
      }

      // Reset password to default if changed by previous run
      const hashedPassword = await bcrypt.hash(tUser.password, 10);
      await prisma.user.update({
        where: { email: tUser.email },
        data: { password: hashedPassword }
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: tUser.email, password: tUser.password });
      authCookie = res.headers['set-cookie'][0];
    });

    it('should change password successfully (Happy Path)', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Cookie', authCookie)
        .send({
          currentPassword: tUser.password,
          newPassword: 'newpassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();

      // Test login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: tUser.email, password: 'newpassword123' });
      expect(loginRes.status).toBe(200);
    });

    it('should return 400 on wrong current password (Unhappy Path)', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Cookie', authCookie)
        .send({
          currentPassword: 'wrongcurrentpassword',
          newPassword: 'newpassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/forgot-password & reset-password', () => {
    beforeAll(async () => {
      const count = await prisma.user.count({ where: { email: tUser.email } });
      if (count === 0) {
        const hashedPassword = await bcrypt.hash(tUser.password, 10);
        await prisma.user.create({
          data: { email: tUser.email, password: hashedPassword, name: tUser.name, role: 'STAFF', isActive: true }
        });
      }
    });

    it('should simulate forgot password email sending', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: tUser.email });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });

    // We can't easily perform E2E for reset token without mocking the email sending
    // or digging into the database to extract the reset token if it's saved there.
    // Assuming ResetPassword creates a RefreshToken or special token in DB or we just test validation.
    it('should return 400 for invalid reset token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'invalid-token-123', newPassword: 'newpassword123' });

      // Assuming domain logic correctly handles invalid tokens and returns error
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
