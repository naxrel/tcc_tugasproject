const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { Pelanggan } = require('../../models');

const registerSchema = z.object({
  nama:     z.string().min(2, 'Nama minimal 2 karakter'),
  username: z.string().min(4, 'Username minimal 4 karakter'),
  email:    z.string().email('Format email tidak valid').optional().or(z.literal('')),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string()
});

exports.register = async (req, res, next) => {
  try {
    const { nama, username, email, password } = registerSchema.parse(req.body);

    const existing = await Pelanggan.findOne({ where: { username } });
    if (existing)
      return res.status(400).json({ status: 'fail', message: 'Username sudah digunakan' });

    const hashed = await bcrypt.hash(password, 12);
    const pelanggan = await Pelanggan.create({
      id: uuidv4(),
      nama,
      username,
      email: email || null,
      password: hashed
    });

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: { id: pelanggan.id, nama: pelanggan.nama, username: pelanggan.username }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const pelanggan = await Pelanggan.findOne({ where: { username } });
    if (!pelanggan)
      return res.status(401).json({ status: 'fail', message: 'Username atau password salah' });

    const match = await bcrypt.compare(password, pelanggan.password);
    if (!match)
      return res.status(401).json({ status: 'fail', message: 'Username atau password salah' });

    const token = jwt.sign(
      { id: pelanggan.id, username: pelanggan.username, nama: pelanggan.nama },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: { id: pelanggan.id, nama: pelanggan.nama, username: pelanggan.username }
    });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Hardcode kredensial admin untuk saat ini (bisa dipindah ke .env nanti)
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'admin123';

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ status: 'fail', message: 'Username atau password admin salah' });
    }

    const token = jwt.sign(
      { id: 'admin-001', role: 'admin', nama: 'Kasir Utama' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: { id: 'admin-001', role: 'admin', nama: 'Kasir Utama' }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: 'Logout berhasil' });
  } catch (err) {
    next(err);
  }
};
