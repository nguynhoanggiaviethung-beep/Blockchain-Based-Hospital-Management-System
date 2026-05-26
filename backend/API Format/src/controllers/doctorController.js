const Doctor = require('../models/doctor');

// POST /doctors — Tạo bác sĩ mới (Admin)
exports.createDoctor = async (req, res) => {
  try {
    const { fullName, specialty, licenseNumber, walletAddress } = req.body;

    if (!fullName || !specialty || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin bác sĩ'
      });
    }

    const existing = await Doctor.findOne({ licenseNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Số giấy phép hành nghề này đã tồn tại!'
      });
    }

    const doctor = new Doctor({ fullName, specialty, licenseNumber, walletAddress });
    await doctor.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ bác sĩ thành công!',
      data: { doctorId: doctor._id }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// GET /doctors/:id — Xem thông tin bác sĩ
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ!' });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};