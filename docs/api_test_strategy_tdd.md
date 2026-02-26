# Comprehensive API Test & TDD Strategy

Sesuai dengan **Clean Architecture & TDD Standards** yang telah ditetapkan, berikut adalah strategi pengujian dan audit dari _Test Plan_ untuk seluruh endpoint di aplikasi `warehouse-backend`. Rencana ini berfokus pada pemisahan layer, _Test-Driven Development (TDD)_, _Dependency Injection_, serta pencapaian _coverage_ 90% pada layer Domain.

## 1. Arsitektur Pengujian (Clean Architecture)

Aplikasi memiliki pemisahan 3 lapis utama. Pengujian harus dilakukan seketat mungkin pada masing-masing layer untuk memastikan aplikasi modular dan _testable_.

### A. Domain Layer (Unit Testing)

- **Cakupan**: Entities dan Use Cases (mis. `CreateStockInUseCase`, `GetDashboardSummaryUseCase`).
- **Target Coverage**: **Minimal 90%**.
- **Aturan**:
  - Tidak boleh ada koneksi ke database atau library eksternal. Semua interaksi keluar (seperti akses ke database) **WAJIB** di-mock melalui Interface Repository (`IInventoryRepository`, `ITransactionRepository`, dll).
  - Validasi _Business Logic_ (seperti stok tidak boleh minus saat `Stock Out`, atau perpindahan stok yang sesuai saat validasi `Transfer`).
  - Harus menguji **Result Pattern**, memastikan `isSuccess` true saat berhasil, dan menguji balikan tipe _Error_ yang spesifik jika gagal (misal: ValidationError, NotFoundError).

### B. Interface Adapters Layer (Unit / Integration Testing)

- **Cakupan**: Controllers (mis. `TransactionController`, `WarehouseController`) dan Middlewares (`authMiddleware`, `roleMiddleware`).
- **Aturan**:
  - Menguji pemanggilan dari request Express (`req`, `res`) ke eksekusi Use Case.
  - Memastikan _Dependency Injection_ (menggunakan `tsyringe`) berjalan dengan baik dengan cara _mock_ interaksi Use Case dan memeriksa apakah HTTP Status Code dan response format JSON yang dikembalikan Controller (`200 OK`, `201 Created`, `400 Bad Request`, `401/403` dll) sudah tepat sesuai Result yang dikembalikan oleh use case.

### C. Infrastructure Layer (Integration / E2E Testing)

- **Cakupan**: Repository class (mis. eksekusi query PostgreSQL via Prisma), external services, dan e2e endpoint routing.
- **Aturan**:
  - Melakukan tes dengan Test Database terisolasi.
  - Setup dan Teardown (mengosongkan test database tiap kali tes berjalan).
  - Melakukan _End-to-End_ (E2E) testing dengan alat bantu seperti `Supertest` pada route-route Express secara utuh dari request ke response (menyentuh router, controller, use case, dan test DB).

## 2. Metodologi TDD (Red-Green-Refactor)

Penerapan pada setiap pembuatan fitur atau _bug fixing_ API endpoint:

1. **Red**: Tulis unit test untuk Use Case / Controller API terlebih dahulu. Pastikan test ini GAGAL. Eksekusi ini wajib disertakan dalam _Commit_ / _Pull Request_.
2. **Green**: Tuliskan implementasi minimal pada layer terkait (Controller/Use Case/Repository) sampai test BERHASIL.
3. **Refactor**: Rapikan kode (Terapkan prinsip DRY & SOLID), pindahkan fungsi berulang menjadi _helper_, tanpa membuat satupun test gagal.

## 3. Rencana Pengujian Endpoint (E2E API Test Checklist)

Selain Unit Test di Domain Layer, setiap endpoint di bawah ini wajib memiliki Integration/E2E test minimal 1 _Happy Path_ dan kumpulan _Unhappy Paths_.

### Auth & User Management (`/api/auth`, `/api/users`)

- **Happy Path**:
  - Login berhasil, JWT Token di-_set_ di HTTP-Only cookie.
  - `SUPER_ADMIN` berhasil membuat user baru.
  - User berhasil _upload avatar_ (multipart form-data).
- **Unhappy / Edge Cases**:
  - Login password salah (wajib return Custom Error di level domain, dilanjutkan `401` di controller).
  - STAFF mencoba akses `/api/users` (wajib ditolak oleh `roleMiddleware` mengembalikan `403`).

### Master Data (`/api/warehouses`, `/api/settings`)

- **Happy Path**:
  - CRUD Gudang (`/api/warehouses`), Kategori (`/categories`), dan Unit (`/units`).
- **Unhappy / Edge Cases**:
  - Membuat kategori dengan nama duplikat (wajib di-_catch_ oleh _Result Pattern_ dari `Prisma/DB constraint` menjadi error logikal Domain, misal `CategoryAlreadyExistsError`).
  - Hapus gudang yang masih memiliki relasi transaksi (wajib dibatalkan atau soft-delete divalidasi).

### Inventory & Stock (`/api/inventory`)

- **Happy Path**:
  - List inventory berjalan dengan paginasi, pencarian (`search`), dan filter kategori yang sesuai.
- **Unhappy / Edge Cases**:
  - Pencarian dengan SKU yang tidak ada (Pastikan mengembalikan `404 Not Found` terstruktur melalui Result Pattern).

### Transactions (`/api/transactions`)

Ini adalah _Core Logic_, fikuskan TDD maksimal di Use Case layer ini.

- **Stock In / Out**:
  - Test validasi minimum kuantitas (> 0).
  - Test _Concurrency_ jika memungkinkan (misal, 2 stock out secara bersamaan di sisa stok terbatas) → Pastikan level isolation database Prisma menangani dengan tepat.
- **Transfer**:
  - Step 1: Membuat Transfer (Status `PENDING`, stok gudang asal **dikunci / dikurangi**).
  - Step 2: Approve Transfer oleh target Warehouse `WH_MANAGER` (Stok gudang tujuan bertambah, status `COMPLETED`).
  - Step 2 (Alt): Reject Transfer (Status `REJECTED`, stok gudang asal **dikembalikan / di-rollback**).

### Report, Dashboard & Notification

- **Happy Path**:
  - Reporting data (Stock, Financial, Expenditure) harus merepresentasikan agregasi dari `Inventory` dan `Transaction` mock.
  - Sistem otomatis membuat `Notification` di database saat Status Transfer berubah. User dapat mengubah flag `isRead`.

## 4. Pipeline CI/CD Checklist (Workflow Git)

Rencana pengujian tidak akan berjalan tanpa _Enforcement_ sistematis.

- **Pre-commit / Pre-push Hooks**: `vitest run` (atau Jest) harus tereksekusi.
- **CI Server (GitHub Actions/GitLab CI)**:
  - Eksekusi Linter (`npm run lint`).
  - Eksekusi Unit Test (Layer Domain & Interface).
  - Ekeskusi Integration Test menggunakan Test Database (Postgres containerized).
  - Cek _Coverage_ (wajib `> 90%` untuk branch business-logic/domain). Jika `< 90%` atau ada 1 _test suite_ yang gagal, **PR wajib di tolak (Reject Merge)**.
