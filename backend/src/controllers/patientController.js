// API Format/src/controllers/patientController.js

// Hàm lấy danh sách tất cả bệnh nhân
const getAllPatients = async (req, res) => {
    try {
        // Code xử lý lấy danh sách của bạn...
        return res.status(200).json({ success: true, message: "Lấy danh sách bệnh nhân thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Hàm lấy chi tiết 1 bệnh nhân theo ID
const getPatientById = async (req, res) => {
    try {
        // Code xử lý lấy chi tiết của bạn...
        return res.status(200).json({ success: true, message: "Lấy chi tiết bệnh nhân thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 🔥 ĐỒNG BỘ XUẤT HÀM THEO CHUẨN NODEMY
module.exports = {
    getAllPatients,
    getPatientById
};