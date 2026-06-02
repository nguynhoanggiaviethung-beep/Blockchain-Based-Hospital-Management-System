// API Format/src/controllers/medicalRecordController.js

// 1. Hàm tạo bệnh án mới
const createRecord = async (req, res) => {
    try {
        // Code xử lý tạo bệnh án của bạn...
        return res.status(201).json({ success: true, message: "Tạo bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Hàm lấy chi tiết bệnh án
const getRecordById = async (req, res) => {
    try {
        // Code xử lý lấy bệnh án của bạn...
        return res.status(200).json({ success: true, message: "Lấy chi tiết bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 🔥 GOM XUẤT HÀM CHUẨN ĐỒNG BỘ
module.exports = {
    createRecord,    // Hãy chắc chắn tên hàm này trùng với tên bạn gọi ở file Route
    getRecordById
};