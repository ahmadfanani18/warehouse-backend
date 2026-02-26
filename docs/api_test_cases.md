# Detailed API Test Cases Plan (Exhaustive)

Dokumen ini berisi daftar _Test Cases_ terperinci untuk mengimplementasikan _End-to-End API Testing_ berdasarkan strategi TDD di `docs/api_test_strategy_tdd.md`. Semua endpoint (46 endpoint) dari modul backend dimasukkan ke dalam daftar periksa ini.

---

## 1. Auth API (`/api/auth`)

- [x] **POST `/api/auth/login`**: Test Login kredensial benar (200), salah (401), input kosong (400).
- [x] **GET `/api/auth/me`**: Test akses user profile dgn cookie valid (200) dan tanpa cookie (401).
- [x] **POST `/api/auth/logout`**: Test Logout membersihkan cookie akses (200).
- [x] **PUT `/api/auth/change-password`**: Test ubah password benar (200), salah password lama (400).
- [x] **POST `/api/auth/forgot-password`**: Test kirim email reset password (200).
- [x] **POST `/api/auth/reset-password`**: Test konfirmasi token reset sandi (200).

---

## 2. User & Profile API (`/api/users`)

- [x] **GET `/api/users`**: List users khusus `SUPER_ADMIN` (200), test role forbidden/403.
- [x] **POST `/api/users`**: Buat user baru oleh `SUPER_ADMIN` (201), validasi duplikasi email (400/409).
- [x] **GET `/api/users/profile`**: Get spesifik user profile/diri sendiri.
- [x] **PUT `/api/users/profile`**: Update nama/telepon profil diri sendiri.
- [x] **POST `/api/users/avatar`**: Test integrasi multer _file upload_ avatar.
- [x] **PUT `/api/users/:id`**: Update role/data user lain (hanya `SUPER_ADMIN`).
- [x] **DELETE `/api/users/:id`**: Soft-delete user (hanya `SUPER_ADMIN`).

---

## 3. Warehouse API (`/api/warehouses`)

- [ ] **GET `/api/warehouses`**: List gudang, filter berdasarkan hak akses WH_MANAGER vs SUPER_ADMIN.
- [ ] **POST `/api/warehouses`**: Buat gudang baru dgn kode unik (`SUPER_ADMIN`).
- [ ] **PUT `/api/warehouses/:id`**: Update gudang.
- [ ] **DELETE `/api/warehouses/:id`**: (Soft/Hard) Delete cek dependensi transaksi.

---

## 4. Settings API (`/api/settings`)

**Categories:**

- [ ] **GET `/api/settings/categories`**: List kategori produk.
- [ ] **POST `/api/settings/categories`**: Tambah kategori baru (`SUPER_ADMIN`).
- [ ] **PUT `/api/settings/categories/:id`**: Edit nama/deskripsi kategori.
- [ ] **DELETE `/api/settings/categories/:id`**: Cek error constraint bila masih dipakai inventory.

**Units:**

- [ ] **GET `/api/settings/units`**: List unit produk.
- [ ] **POST `/api/settings/units`**: Tambah unit baru (`SUPER_ADMIN`).
- [ ] **PUT `/api/settings/units/:id`**: Edit unit.
- [ ] **DELETE `/api/settings/units/:id`**: Hapus unit/cek constraint.

---

## 5. Inventory API (`/api/inventory`)

- [ ] **GET `/api/inventory`**: Test _pagination_, query `search`, dan query `categoryId`.
- [ ] **GET `/api/inventory/:sku`**: Ambil detail by SKU.
- [ ] **POST `/api/inventory`**: Tambah master produk/inventory (`SUPER_ADMIN` / `WH_MANAGER`).
- [ ] **PUT `/api/inventory/:sku`**: Update master data stok/harga beli.
- [ ] **DELETE `/api/inventory/:sku`**: Hapus inventory (jika saldo stok 0 / tidak terelasi).

---

## 6. Transaction API (`/api/transactions`)

- [ ] **POST `/api/transactions/stock-in`**: Test penambahan stok _synchronous_ di DB inventory (+).
- [ ] **POST `/api/transactions/stock-out`**: Test potong stok DB (-) & validasi error jika `qty > stock`.
- [ ] **POST `/api/transactions/transfer`**: Test request mutasi, validasi status `PENDING`, cek stok asal langsung dilock/berkurang (-).
- [ ] **GET `/api/transactions/transfer/pending`**: Cek notifikasi pending masuk di target gudang.
- [ ] **PUT `/api/transactions/transfer/:id/approve`**: Test update DB `COMPLETED`, gudang tujuan stok bertambah (+).
- [ ] **PUT `/api/transactions/transfer/:id/reject`**: Test update DB `REJECTED`, _rollback_ mengembalikan stok asal (+).
- [ ] **GET `/api/transactions/history`**: Rekap history transaksi, query params filtering date/type/gudang.

---

## 7. Dashboard API (`/api/dashboard`)

- [ ] **GET `/api/dashboard/summary`**: Validasi metrik aggregasi berjalan (total gudang, stok masuk, keluar).
- [ ] **GET `/api/dashboard/activities`**: Validasi umpan/log aktivitas mutakhir.

---

## 8. Report API (`/api/reports`)

- [ ] **GET `/api/reports/stock`**: Rekap hitungan/log stok (SUPER_ADMIN, WH_MANAGER).
- [ ] **GET `/api/reports/financial`**: Metrik kapital inventory \* harga beli (khusus SUPER_ADMIN).
- [ ] **GET `/api/reports/expenditure`**: Evaluasi data riwayat (khusus SUPER_ADMIN).

---

## 9. Notification API (`/api/notifications`)

- [ ] **GET `/api/notifications`**: List notifikasi user & verifikasi atribut `unreadCount`.
- [ ] **PUT `/api/notifications/:id/read`**: Tandai 1 pesan terbaca (`isRead = true`).
- [ ] **PUT `/api/notifications/read-all`**: Tandai seluruh notifikasi sbg terbaca.

## Aturan Eksekusi

_Centang (`[x]`) pada plan ini setiap kali test-suite per modul (seperti `api/auth`) rampung 100% integrasi coverage-nya via Test-DB Vitest._
