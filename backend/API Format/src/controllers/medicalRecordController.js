const MedicalRecord = require('../models/MedicalRecord');

// POST /medical-records — Tạo hồ sơ y tế (Doctor)
exports.createMedicalRecord = async (req, res) => {
  try {
    const { visitId, patientId, doctorId, diagnosis, notes } = req.body;

    if (!visitId || !patientId || !doctorId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    const record = new MedicalRecord({ visitId, patientId, doctorId, diagnosis, notes });
    await record.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ y tế thành công!',
      data: { recordId: record._id }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// PUT /medical-records/:id — Cập nhật hồ sơ y tế (Doctor)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { diagnosis, notes } = req.body;

    const newIpfsHash = 'QmZabc' + Math.random().toString(36).substring(2, 15);

    const updated = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { diagnosis, notes, ipfsHash: newIpfsHash },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ y tế!' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ y tế thành công!',
      data: { updated: true, newIpfsHash: updated.ipfsHash }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};
