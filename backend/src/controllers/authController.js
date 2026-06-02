const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { fullName, email, password, role, dob, gender, phone, address, citizenId } = req.body;

    const db = mongoose.connection.db;

    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
    }

    if (role === 'patient' && citizenId) {
      const cccdDaTon = await db.collection('patients').findOne({ citizenId });
      if (cccdDaTon) {
        return res.status(400).json({ success: false, message: 'Số CCCD này đã được đăng ký!' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const commonId = new mongoose.Types.ObjectId();

    await db.collection('users').insertOne({
      _id: commonId,
      fullName, email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (role === 'patient') {
      await db.collection('patients').insertOne({
        _id: commonId,
        fullName,
        dob:       dob       || '',
        gender:    gender    || '',
        phone:     phone     || '',
        address:   address   || '',
        citizenId: citizenId || '',
        nhomMau: '', tienSuBenh: '', diUng: '', trieuChung: '', ghiChu: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công!',
      data: { userId: commonId, fullName, email, role }
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
      data: {
        token, role,
        fullName: user.fullName || 'Người dùng VNmedID',
        userId: user._id.toString()
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

const registerPatient = async (req, res) => {
  try {
    const { email, password, fullName, dob, gender, phone, address, citizenId } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' });
    }

    const db = mongoose.connection.db;

    const emailDaTon = await db.collection('users').findOne({ email });
    if (emailDaTon) {
      return res.status(400).json({ success: false, message: 'Email này đã được đăng ký!' });
    }

    if (citizenId) {
      const cccdDaTon = await db.collection('patients').findOne({ citizenId });
      if (cccdDaTon) {
        return res.status(400).json({ success: false, message: 'Số CCCD này đã được đăng ký!' });
      }
    }

    const commonId = new mongoose.Types.ObjectId();
    const matKhauMaHoa = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      _id: commonId,
      fullName, email,
      password: matKhauMaHoa,
      role: 'patient',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.collection('patients').insertOne({
      _id: commonId,
      fullName,
      dob:       dob       || '',
      gender:    gender    || '',
      phone:     phone     || '',
      address:   address   || '',
      citizenId: citizenId || '',
      nhomMau: '', tienSuBenh: '', diUng: '', trieuChung: '', ghiChu: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản bệnh nhân thành công!',
      data: { userId: commonId, fullName, email, role: 'patient' }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

module.exports = { register, login, registerPatient };