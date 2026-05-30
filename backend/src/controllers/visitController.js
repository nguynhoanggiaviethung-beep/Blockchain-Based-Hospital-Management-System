const Visit = require('../models/Visit');

// POST /visits — Tạo lượt khám (Doctor)
exports.createVisit = async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, prescription } = req.body;

    if (!patientId || !symptoms || !diagnosis || !prescription) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin lượt khám'
      });
    }

    const mockIpfsHash = 'QmXoypuj' + Math.random().toString(36).substring(2, 15);
    const visit = new Visit({ patientId, symptoms, diagnosis, prescription, ipfsHash: mockIpfsHash });
    await visit.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo lượt khám thành công!',
      data: { visitId: visit._id }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// GET /visits/patient/:patientId — Lịch sử khám của bệnh nhân
exports.getVisitsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const visits = await Visit.find({ patientId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Lấy lịch sử khám thành công!',
      data: {
        total: visits.length,
        visits
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// GET /visits/:id — Xem chi tiết 1 lượt khám
exports.getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lượt khám này!'
      });
    }

    return res.status(200).json({
      success: true,
      data: visit
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};

// PUT /visits/:id — Cập nhật lượt khám (Doctor)
exports.updateVisit = async (req, res) => {
  try {
    const { symptoms, diagnosis, prescription } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { symptoms, diagnosis, prescription },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lượt khám này!'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật lượt khám thành công!',
      data: visit
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
  }
};
