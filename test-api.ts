import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';
let cookie = '';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: () => true, // Don't throw on non-200
});

api.interceptors.request.use(config => {
  if (cookie) {
    config.headers['Cookie'] = cookie;
  }
  return config;
});

async function login() {
  const res = await api.post('/auth/login', {
    email: 'admin@warehouse.com',
    password: 'password123'
  });
  
  if (res.status === 200) {
    const setCookie = res.headers['set-cookie'];
    if (setCookie && setCookie.length > 0) {
      cookie = setCookie[0].split(';')[0];
    }
    console.log('Login successful');
  } else {
    console.error('Login failed', res.data);
  }
}

async function testWarehouse() {
  console.log('\n--- Testing Warehouses ---');
  // Create
  let res = await api.post('/warehouses', {
    code: 'WH-TEST',
    name: 'Test Warehouse',
    address: 'Test Address'
  });
  console.log('Create:', res.status, res.data);
  
  if (res.status === 201) {
    const id = res.data.data.id;
    // Update
    res = await api.put(`/warehouses/${id}`, {
      name: 'Updated Test Warehouse'
    });
    console.log('Update:', res.status, res.data);

    // Get All
    res = await api.get('/warehouses');
    console.log('Get All:', res.status, res.data.data.length, 'items');

    // Delete (commented to keep for inventory test)
    // res = await api.delete(`/warehouses/${id}`);
    // console.log('Delete:', res.status, res.data);
  }
}

async function testCategory() {
  console.log('\n--- Testing Categories ---');
  let res = await api.post('/settings/categories', {
    name: 'Test Category',
    description: 'Test Description'
  });
  console.log('Create Category:', res.status, res.data);
  
  if (res.status === 201) {
    const id = res.data.data.id;
    res = await api.put(`/settings/categories/${id}`, {
      name: 'Updated Test Category'
    });
    console.log('Update Category:', res.status, res.data);

    res = await api.get('/settings/categories');
    console.log('Get All Categories:', res.status, res.data.data.length, 'items');

    // res = await api.delete(`/settings/categories/${id}`);
    // console.log('Delete Category:', res.status, res.data);
  }
}

async function testUnit() {
  console.log('\n--- Testing Units ---');
  let res = await api.post('/settings/units', {
    name: 'Test Unit',
    abbreviation: 'TU'
  });
  console.log('Create Unit:', res.status, res.data);
  
  if (res.status === 201) {
    const id = res.data.data.id;
    res = await api.put(`/settings/units/${id}`, {
      abbreviation: 'TUU'
    });
    console.log('Update Unit:', res.status, res.data);

    res = await api.get('/settings/units');
    console.log('Get All Units:', res.status, res.data.data.length, 'items');

    // res = await api.delete(`/settings/units/${id}`);
    // console.log('Delete Unit:', res.status, res.data);
  }
}

async function testInventory() {
  console.log('\n--- Testing Inventory ---');

  // get existing warehouse & category & unit for IDs
  const cRes = await api.get('/settings/categories');
  const uRes = await api.get('/settings/units');
  const wRes = await api.get('/warehouses');

  if (!cRes.data.data[0] || !uRes.data.data[0] || !wRes.data.data[0]) {
      console.log('Missing category, unit or warehouse to test Inventory');
      return;
  }

  const cid = cRes.data.data[0].id;
  const uid = uRes.data.data[0].id;
  const wid = wRes.data.data[0].id;

  const sku = 'LAPTOP-001';

  // Create Product & Initial Stock
  let res = await api.post('/inventory', {
    sku,
    name: 'Asus Zenbook 14',
    categoryId: cid,
    unitId: uid,
    warehouseId: wid,
    purchasePrice: 15000000,
    stock: 50
  });
  console.log('Create Inventory:', res.status, res.data);
  
  if (res.status === 201) {
    // Update
    res = await api.put(`/inventory/${sku}`, {
      name: 'Asus Zenbook 14X OLED'
    });
    console.log('Update Inventory:', res.status, res.data);

    // Get All
    res = await api.get('/inventory');
    console.log('Get All Inventories:', res.status, res.data.data.length, 'items');

    // Get Detail
    res = await api.get(`/inventory/${sku}`);
    console.log('Get Detail Inventory:', res.status, res.data);

    // Delete
    // res = await api.delete(`/inventory/${sku}`);
    // console.log('Delete Inventory:', res.status, res.data);
  }
}

async function testTransaction() {
  console.log('\n--- Testing Transactions ---');

  let wRes = await api.get('/warehouses');
  
  // Make sure we have 2 warehouses
  if (wRes.data.data.length < 2) {
      console.log('Creating Source and Target Warehouses...');
      await api.post('/warehouses', {
        code: `WH-SRC-${Date.now()}`,
        name: 'Source Warehouse',
        address: 'Source Address'
      });
      await api.post('/warehouses', {
        code: `WH-TGT-${Date.now()}`,
        name: 'Target Warehouse',
        address: 'Target Address'
      });
      wRes = await api.get('/warehouses');
  }

  let iRes = await api.get('/inventory');
  if (iRes.data.data.length === 0) {
      console.log('Creating Product for Inventory...');
      // Need category and unit
      let cat = await api.get('/settings/categories');
      if (cat.data.data.length === 0) {
          await api.post('/settings/categories', { name: 'Elektronik', description: 'Elektronik' });
          cat = await api.get('/settings/categories');
      }
      let unit = await api.get('/settings/units');
      if (unit.data.data.length === 0) {
          await api.post('/settings/units', { name: 'Pcs', abbreviation: 'pcs' });
          unit = await api.get('/settings/units');
      }
      
      const cid = cat.data.data[0].id;
      const uid = unit.data.data[0].id;
      const wid = wRes.data.data[0].id;

      await api.post('/inventory', {
        sku: `SKU-${Date.now()}`,
        name: 'Transaction Test Product',
        categoryId: cid,
        unitId: uid,
        warehouseId: wid,
        purchasePrice: 15000000,
        stock: 50
      });
      
      iRes = await api.get('/inventory');
  }

  const wSource = wRes.data.data[0].id;
  const wTarget = wRes.data.data[1].id;
  const product = iRes.data.data[0];
  const prodId = product.product.id;

  // 1. Stock In
  let res = await api.post('/transactions/stock-in', {
    warehouseId: wSource,
    items: [{ sku: product.sku, productId: prodId, quantity: 20 }],
    supplier: 'Supplier XYZ',
    notes: 'Restock mingguan'
  });
  console.log('Stock In:', res.status, res.data.message);

  // 2. Stock Out
  res = await api.post('/transactions/stock-out', {
    warehouseId: wSource,
    items: [{ sku: product.sku, productId: prodId, quantity: 5 }],
    destination: 'Toko B',
    notes: 'Pengiriman barang'
  });
  console.log('Stock Out:', res.status, res.data.message);

  // 3. Transfer
  res = await api.post('/transactions/transfer', {
    sourceWarehouseId: wSource,
    targetWarehouseId: wTarget,
    items: [{ sku: product.sku, productId: prodId, quantity: 10 }],
    notes: 'Pemindahan antar cabang'
  });
  console.log('Create Transfer:', res.status, res.data.message);
  
  if (res.status === 201) {
    const trxId = res.data.data.id;

    // 4. Pending Transfers
    res = await api.get(`/transactions/transfer/pending?warehouseId=${wTarget}`);
    console.log('Pending Transfers for Target WH:', res.status, res.data.total, 'items');

    // 5. Approve Transfer
    res = await api.put(`/transactions/transfer/${trxId}/approve`, {
      notes: 'Diterima dengan baik'
    });
    console.log('Approve Transfer:', res.status, res.data.message);
  }

  // 6. History
  res = await api.get('/transactions/history');
  console.log('Transaction History:', res.status, res.data.total, 'items');
}

async function testDashboardAndReports() {
  console.log('\n--- Testing Dashboard & Reports ---');

  // 1. Dashboard Summary
  let res = await api.get('/dashboard/summary');
  console.log('Dashboard Summary:', res.status, res.data);

  // 2. Dashboard Activities
  res = await api.get('/dashboard/activities');
  console.log('Dashboard Activities:', res.status, res.data.activities.length, 'items');

  // 3. Stock Report
  res = await api.get('/reports/stock');
  console.log('Stock Report:', res.status, 'Total Stock:', res.data.totalStock);

  // 4. Financial Report
  res = await api.get('/reports/financial');
  console.log('Financial Report:', res.status, 'Total Value:', res.data.totalValue);

  // 5. Expenditure Report
  res = await api.get('/reports/expenditure');
  console.log('Expenditure Report:', res.status, 'Total Expenditure:', res.data.totalExpenditure);
}

async function testNotification() {
  console.log('\n--- Testing Notifications ---');

  // Insert mock notification manually first
  const userRes = await axios.get(`${API_URL}/auth/me`, {
    headers: { Cookie: cookie }
  });
  const userId = userRes.data.user.id;

  await prisma.notification.create({
    data: {
      userId: userId,
      title: 'Transfer Masuk',
      message: 'Ada transfer barang SKU: HP-15 sejumlah 5 dari Gudang A',
      type: 'TRANSFER_PENDING',
      isRead: false
    }
  });

  // Now perform API tests
  let res = await api.get('/notifications');
  console.log('Get Notifications:', res.status, 'Unread:', res.data.unreadCount, 'Total:', res.data.data.length);

  if (res.data.data.length > 0) {
      const notifId = res.data.data[0].id;
      
      // Mark one as read
      res = await api.put(`/notifications/${notifId}/read`);
      console.log('Mark As Read:', res.status, res.data.message);

      // Verify unread count decreased
      res = await api.get('/notifications');
      console.log('Unread Count after marking one:', res.data.unreadCount);

      // Mark all as read
      res = await api.put('/notifications/read-all');
      console.log('Mark All As Read:', res.status, res.data.message);

      // Verify all are read
      res = await api.get('/notifications');
      console.log('Final Unread Count:', res.data.unreadCount);
  } else {
      console.log('No notifications found to test mark-as-read. Please ensure notifications are generated by transactions first.');
  }
}

async function run() {
  await login();
  if (cookie) {
    // await testWarehouse();
    // await testCategory();
    // await testUnit();
    // await testInventory();
    await testTransaction();
    await testDashboardAndReports();
    await testNotification();
  }
}

run();
