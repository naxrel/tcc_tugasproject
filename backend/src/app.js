const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { ZodError } = require('zod');
require('dotenv').config();

// MongoDB connection
require('./utils/mongo');

const app = express();

// ── GLOBAL MIDDLEWARE ──────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(hpp());
app.use(cors());
app.use(morgan('dev'));

// Rate limiter
const limiter = rateLimit({
  max: 5000, // Diperbesar untuk testing
  windowMs: 5 * 60 * 1000, // Reset setiap 5 menit
  message: 'Terlalu banyak request, coba lagi nanti.'
});
app.use('/api', limiter);

// ── ROUTES ────────────────────────────────────────
app.use('/api/v1/auth',        require('./routes/authRoutes'));
app.use('/api/v1/pelanggan',   require('./routes/pelangganRoutes'));
app.use('/api/v1/barber',      require('./routes/barberRoutes'));
app.use('/api/v1/kursi',       require('./routes/kursiRoutes'));
app.use('/api/v1/layanan',     require('./routes/layananRoutes'));
app.use('/api/v1/booking',     require('./routes/bookingRoutes'));
app.use('/api/v1/pembayaran',  require('./routes/pembayaranRoutes'));
app.use('/api/v1/antrean',     require('./routes/antreanRoutes'));
app.use('/api/v1/notifikasi',  require('./routes/notifikasiRoutes'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Barbershop API is Running! 💈' });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────
app.use((err, req, res, next) => {
  console.error('ERROR:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validasi gagal',
      errors: err.errors.map(e => ({ path: e.path[0], message: e.message }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(400).json({ status: 'fail', message: 'Data sudah ada' });

  if (err.name === 'SequelizeForeignKeyConstraintError')
    return res.status(400).json({ status: 'fail', message: 'Relasi data tidak ditemukan' });

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Terjadi kesalahan pada server'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}... 🚀`));
