# 💈 Manajemen Antrean Pangkas Rambut

> **Sistem pemesanan slot potong rambut berdasarkan estimasi waktu selesai**

Menyelesaikan masalah waktu tunggu yang membosankan di barbershop tanpa kepastian giliran — dengan sistem antrean digital yang realtime.

---

## 🎯 Platform

| Platform | Pengguna | Fungsi Utama |
|---|---|---|
| 🌐 **Web (Kasir)** | Admin / Kasir | Update status kursi, kelola booking, monitor antrean |
| 📱 **Mobile (Pelanggan)** | Pelanggan | Booking slot, lihat posisi antrean, terima notifikasi giliran |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐     HTTP/REST     ┌──────────────────────────┐
│  Mobile App     │ ◄────────────────► │                          │
│  (Pelanggan)    │                    │   Express.js API Server  │
└─────────────────┘                    │      Port 3000           │
                                       │                          │
┌─────────────────┐     HTTP/REST     │                          │
│  Web App        │ ◄────────────────► │                          │
│  (Kasir/Admin)  │                    └──────┬─────────┬─────────┘
└─────────────────┘                           │         │
                                              ▼         ▼
                                      ┌───────────┐ ┌──────────┐
                                      │  MySQL    │ │ MongoDB  │
                                      │ (Cloud SQL│ │ (Local / │
                                      │   GCP)    │ │  Citrix) │
                                      └───────────┘ └──────────┘
```

---

## 🗄️ Database

### SQL — MySQL (Cloud SQL GCP)
> Data permanen & terstruktur

| Tabel | Fungsi |
|---|---|
| `pelanggan` | Data akun pelanggan |
| `barber` | Data karyawan barber |
| `kursi` | Kursi fisik di barbershop |
| `layanan` | Jenis layanan & harga (cukur, creambath, dll) |
| `booking` | Transaksi pemesanan antrean |
| `pembayaran` | Record pembayaran per booking |
| `jadwal_potong` | Jam kerja tiap barber per hari |

### NoSQL — MongoDB (Local / Citrix)
> Data realtime & cepat berubah

| Collection | Fungsi |
|---|---|
| `antrean_realtime` | Posisi & estimasi antrean saat ini |
| `notifikasi` | Push notif giliran ke pelanggan |
| `slot_tersedia` | Cache kursi yang bisa dipesan |
| `status_kursi` | Kondisi tiap kursi secara live |
| `aktivitas_pelanggan` | Log aktivitas user (audit/tracking) |

---

## 🔌 API Endpoints (21 Endpoint)

### 🔐 Auth
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 1 | POST | `/api/v1/auth/register` | Daftar pelanggan baru |
| 2 | POST | `/api/v1/auth/login` | Login pelanggan/admin |
| 3 | POST | `/api/v1/auth/logout` | Logout |

### 👤 Pelanggan
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 4 | GET | `/api/v1/pelanggan/:id` | Lihat profil |
| 5 | PUT | `/api/v1/pelanggan/:id` | Update profil |

### 💈 Barber
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 6 | GET | `/api/v1/barber` | List semua barber |
| 7 | POST | `/api/v1/barber` | Tambah barber (admin) |
| 8 | PUT | `/api/v1/barber/:id` | Update data barber |
| 9 | DELETE | `/api/v1/barber/:id` | Hapus barber |

### 🪑 Kursi
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 10 | GET | `/api/v1/kursi` | List semua kursi + status |
| 11 | PUT | `/api/v1/kursi/:id/status` | Update status kursi (admin) |

### 📅 Booking
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 12 | POST | `/api/v1/booking` | Buat booking baru |
| 13 | GET | `/api/v1/booking/:id` | Detail booking |
| 14 | PUT | `/api/v1/booking/:id/status` | Update status booking |
| 15 | DELETE | `/api/v1/booking/:id` | Batalkan booking |

### 💰 Pembayaran
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 16 | POST | `/api/v1/pembayaran` | Buat pembayaran |
| 17 | GET | `/api/v1/pembayaran/:id` | Detail pembayaran |

### 📊 Antrean (NoSQL)
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 18 | GET | `/api/v1/antrean` | Lihat antrean realtime |
| 19 | GET | `/api/v1/antrean/:booking_id` | Estimasi giliran pelanggan |

### 🔔 Notifikasi (NoSQL)
| # | Method | Endpoint | Fungsi |
|---|---|---|---|
| 20 | GET | `/api/v1/notifikasi/:pelanggan_id` | Lihat notifikasi |
| 21 | PUT | `/api/v1/notifikasi/:id/baca` | Tandai sudah dibaca |

---

## 🔄 Alur Sistem

```
Pelanggan                    Backend                      Kasir/Admin
    │                           │                              │
    │── POST /booking ─────────►│                              │
    │                           │── Simpan ke MySQL            │
    │                           │── Update antrean_realtime ──►│ (MongoDB)
    │                           │── Update slot_tersedia        │
    │◄── { posisi_antrean } ────│                              │
    │                           │                              │
    │── GET /antrean/:id ──────►│                              │
    │◄── { estimasi_menit } ────│                              │
    │                           │                              │
    │                           │◄── PUT /kursi/:id/status ────│
    │                           │── Sync status_kursi (Mongo)  │
    │                           │                              │
    │◄── Notifikasi "Giliran!" ─│◄── PUT /booking/:id/status ──│
    │   (MongoDB notifikasi)    │── Create notifikasi doc       │
    │                           │                              │
    │── POST /pembayaran ──────►│                              │
    │◄── { status: lunas } ─────│                              │
```

---

## 📁 Struktur Project

```
backend/
├── .env                    ← Kredensial DB & JWT
├── .sequelizerc            ← Config CLI Sequelize
├── config/
│   └── config.js           ← MySQL config (baca dari .env)
├── migrations/             ← 7 migration tabel MySQL
│   ├── ...-create-pelanggan.js
│   ├── ...-create-barber.js
│   ├── ...-create-layanan.js
│   ├── ...-create-kursi.js
│   ├── ...-create-jadwal-potong.js
│   ├── ...-create-booking.js
│   └── ...-create-pembayaran.js
├── models/                 ← 7 Sequelize Model
│   ├── Pelanggan.js
│   ├── Barber.js
│   ├── Layanan.js
│   ├── Kursi.js
│   ├── Booking.js
│   ├── Pembayaran.js
│   └── JadwalPotong.js
└── src/
    ├── app.js              ← Entry point Express
    ├── controllers/        ← 9 controller
    │   ├── authController.js        ✅ Implementasi penuh
    │   ├── barberController.js      ✅ Implementasi penuh
    │   ├── layananController.js     ✅ Implementasi penuh
    │   ├── pelangganController.js   🔄 Skeleton
    │   ├── kursiController.js       🔄 Skeleton
    │   ├── bookingController.js     🔄 Skeleton
    │   ├── pembayaranController.js  🔄 Skeleton
    │   ├── antreanController.js     ✅ Mongoose model siap
    │   └── notifikasiController.js  ✅ Mongoose model siap
    ├── middleware/
    │   └── protect.js      ← JWT guard
    ├── routes/             ← 9 route file
    └── utils/
        └── mongo.js        ← Koneksi MongoDB (opsional)

frontend/
└── index.html              ← API Tester UI
```

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| ORM (SQL) | Sequelize |
| ODM (NoSQL) | Mongoose |
| Database SQL | MySQL (XAMPP dev / Cloud SQL GCP prod) |
| Database NoSQL | MongoDB |
| Auth | JWT + bcryptjs |
| Validasi | Zod |
| Security | Helmet, HPP, Rate Limit, CORS |

---

## 🚀 Cara Menjalankan

```bash
# 1. Pastikan XAMPP MySQL sudah nyala
# 2. Install dependencies
npm install

# 3. Buat database
npx sequelize-cli db:create

# 4. Jalankan migrasi
npx sequelize-cli db:migrate

# 5. Jalankan server
npm run dev
# → Server jalan di http://localhost:3000
```

### Cek server:
```
GET http://localhost:3000
→ { "message": "Barbershop API is Running! 💈" }
```

---

## ✅ Progress Implementasi

- [x] Setup project & dependencies
- [x] Struktur folder (controllers, routes, middleware, utils)
- [x] Konfigurasi MySQL (config.js + .env)
- [x] 7 Migrations tabel MySQL
- [x] 7 Sequelize Models + asosiasi
- [x] Auth: Register & Login (JWT + bcrypt)
- [x] Barber: CRUD
- [x] Layanan: CRUD
- [x] Antrean & Notifikasi: Mongoose model siap
- [x] Frontend API Tester (HTML)
- [ ] Kursi: implementasi penuh + sync MongoDB
- [ ] Booking: implementasi penuh + hitung estimasi
- [ ] Pembayaran: implementasi penuh
- [ ] Pelanggan: implementasi penuh
- [ ] Seed data awal (barber, layanan, kursi)
- [ ] Deploy ke GCP (Cloud SQL)
