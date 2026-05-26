const Patient = require('../models/Patient');

// POST /patients — Tạo bệnh nhân mới (Admin)
exports.createPatient = async (req, res) => {
  try {
    const { fullName, dob, gender, phone, address, citizenId } = req.body;

    if (!fullName || !dob || !gender || !phone || !address || !citizenId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin bệnh nhân'
      });
    }

    const existing = await Patient.findOne({ citizenId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Số CCCD này đã tồn tại trên hệ thống!'
      });
    }

    const patient = new Patient({ fullName, dob, gender, phone, address, citizenId });
    await patient.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ bệnh nhân thành công!',
      data: { patientId: patient._id }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// GET /patients/:id — Xem thông tin bệnh nhân (Admin, Doctor, Patient)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân!' });
    }
    return res.status(200).json({ success: true, data: patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};
