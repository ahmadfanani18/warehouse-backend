import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma, truncateDB } from './setup';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

describe('User API E2E', () => {
  let adminCookie: string;
  let staffCookie: string;
  let newUserId: string;

  const adminUser = {
    email: 'testadmin@example.com',
    password: 'password123',
    name: 'Admin Test User',
    role: 'SUPER_ADMIN'
  };

  const staffUser = {
    email: 'teststaff@example.com',
    password: 'password123',
    name: 'Staff Test User',
    role: 'STAFF'
  };

  beforeAll(async () => {
    console.log('[User E2E] Starting beforeAll hook');
    console.log('[User E2E] Executing truncateDB...');
    await truncateDB();
    console.log('[User E2E] TruncateDB finished');
    
    // 1. Arrange: Seed Admin and Staff
    console.log('[User E2E] Hashing password...');
    const hashedPwd = await bcrypt.hash('password123', 10);
    
    console.log('[User E2E] Creating admin user...');
    await prisma.user.create({
      data: { email: adminUser.email, password: hashedPwd, name: adminUser.name, role: 'SUPER_ADMIN', isActive: true }
    });

    console.log('[User E2E] Creating staff user...');
    const staff = await prisma.user.create({
      data: { email: staffUser.email, password: hashedPwd, name: staffUser.name, role: 'STAFF', isActive: true }
    });
    
    console.log('[User E2E] Logging in admin...');
    // 2. Act: Login to get cookies
    const adminLoginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
    adminCookie = adminLoginRes.headers['set-cookie'][0];

    console.log('[User E2E] Logging in staff...');
    const staffLoginRes = await request(app).post('/api/auth/login').send({ email: staffUser.email, password: staffUser.password });
    staffCookie = staffLoginRes.headers['set-cookie'][0];
    
    console.log('[User E2E] beforeAll hook finished');
  });

  describe('GET /api/users', () => {
    it('should allow SUPER_ADMIN to list users (Happy Path)', async () => {
      const res = await request(app).get('/api/users').set('Cookie', adminCookie);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 403 Forbidden for STAFF (Unhappy Path)', async () => {
      const res = await request(app).get('/api/users').set('Cookie', staffCookie);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/users', () => {
    it('should allow SUPER_ADMIN to create new user (Happy Path)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Cookie', adminCookie)
        .send({
          email: 'newuser123@example.com',
          password: 'newpassword123',
          name: 'New Assigned User',
          role: 'WH_MANAGER'
        });

      // Based on typical REST conventions, creation yields 201 or 200 with new id.
      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe('newuser123@example.com');
      
      newUserId = res.body.data.id;
    });

    it('should return 400 when creating user with duplicate email (Unhappy Path)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Cookie', adminCookie)
        .send({
          email: 'newuser123@example.com',
          password: 'newpassword123',
          name: 'Duplicate Assigned User',
          role: 'STAFF'
        });

      // Domain logic should throw Conflict or Bad Request
      expect(res.status).toBe(400); 
    });
    
    it('should return 403 when STAFF tries to create user (Unhappy Path)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Cookie', staffCookie)
        .send({ email: 'hackuser@example.com', password: 'pas', name: 'Hack', role: 'WH_MANAGER' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/profile & PUT /api/users/profile', () => {
    it('should allow STAFF to read their own profile', async () => {
      const res = await request(app).get('/api/users/profile').set('Cookie', staffCookie);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(staffUser.email);
    });

    it('should allow STAFF to update their own profile name and phone', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Cookie', staffCookie)
        .send({
          name: 'Staff Test User Updated',
          phone: '+62812345678'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();

      const getRes = await request(app).get('/api/users/profile').set('Cookie', staffCookie);
      expect(getRes.body.data.name).toBe('Staff Test User Updated');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow SUPER_ADMIN to edit other users data', async () => {
       const res = await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Cookie', adminCookie)
        .send({
          name: 'Manager Mod Edit',
          role: 'STAFF'
        });

      expect(res.status).toBe(200);
      
      const userDb = await prisma.user.findUnique({ where: { id: newUserId }});
      expect(userDb?.name).toBe('Manager Mod Edit');
      expect(userDb?.role).toBe('STAFF');
    });
    
    it('should deny STAFF to edit another user', async () => {
       const res = await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Cookie', staffCookie)
        .send({ name: 'Hacked' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should deny STAFF to soft-delete another user', async () => {
       const res = await request(app)
        .delete(`/api/users/${newUserId}`)
        .set('Cookie', staffCookie);

      expect(res.status).toBe(403);
    });

    it('should allow SUPER_ADMIN to soft-delete a user', async () => {
       const res = await request(app)
        .delete(`/api/users/${newUserId}`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      
      const userDb = await prisma.user.findUnique({ where: { id: newUserId }});
      expect(userDb?.isActive).toBe(false); // Validating soft-delete criteria
    });
  });

  describe('POST /api/users/avatar', () => {
    let dummyFilePath: string;

    beforeAll(() => {
      // Create a dummy text file to act as the uploaded "image" for test purpose
      dummyFilePath = path.join(__dirname, 'dummy-avatar.png');
      fs.writeFileSync(dummyFilePath, 'dummy image content');
    });

    afterAll(() => {
      if (fs.existsSync(dummyFilePath)) {
        fs.unlinkSync(dummyFilePath);
      }
    });

    it('should upload an avatar for the user', async () => {
      const res = await request(app)
        .post('/api/users/avatar')
        .set('Cookie', staffCookie)
        .attach('file', dummyFilePath);

      console.dir(res.body, { depth: null });
      expect(res.status).toBe(200);
      expect(res.body.data?.avatarUrl || res.body.avatarUrl).toBeDefined();
    });
  });
});
