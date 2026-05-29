const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const db = mongoose.connection.db;

    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      fullName, email, password: hashedPassword, role,
      createdAt: new Date(), updatedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công!',
      data: { userId: result.insertedId, fullName, email, role }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({ success: false, message: 'Database chưa sẵn sàng!' });
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại!' });
    }

    if (user.role !== role) {
      return res.status(403).json({ success: false, message: `Tài khoản không có quyền đăng nhập với tư cách ${role}!` });
    }

    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
    }

    const secretKey = process.env.JWT_SECRET || 'vnmedid_super_secret_key_2024';
    const token = jwt.sign({ userId: user._id, role }, secretKey, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: { token, role, fullName: user.fullName || 'Người dùng VNmedID' }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

module.exports = { register, login };