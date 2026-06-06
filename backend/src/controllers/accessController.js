// src/controllers/accessController.js
// Module 5 — Access Control

// Lưu danh sách quyền truy cập tạm trong bộ nhớ
// TODO: Sau này chuyển sang MongoDB hoặc Blockchain
const accessLogs = [];

// POST /access/grant — Cấp quyền bác sĩ xem hồ sơ (Admin)
exports.grantAccess = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập doctorId và patientId'
            });
        }

        // Kiểm tra đã cấp quyền chưa
        const daCap = accessLogs.find(
            log => log.doctorId === doctorId && log.patientId === patientId && log.status === 'active'
        );
        if (daCap) {
            return res.status(400).json({
                success: false,
                message: 'Bác sĩ này đã được cấp quyền rồi!'
            });
        }

        // Giả lập txHash blockchain — sau thay bằng blockchain thật
        const mockTxHash = '0x' + Math.random().toString(16).substring(2, 42);

        // Lưu vào danh sách
        accessLogs.push({
            doctorId,
            patientId,
            txHash: mockTxHash,
            status: 'active',
            grantedAt: new Date()
        });

        return res.status(200).json({
            success: true,
            message: 'Cấp quyền truy cập thành công!',
            data: { txHash: mockTxHash }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// GET /access/:patientId — Xem danh sách bác sĩ có quyền xem hồ sơ
exports.getAccessList = async (req, res) => {
    try {
        const { patientId } = req.params;

        const danhSach = accessLogs.filter(
            log => log.patientId === patientId && log.status === 'active'
        );

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách quyền truy cập thành công!',
            data: {
                total: danhSach.length,
                accessList: danhSach
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};

// DELETE /access/revoke — Thu hồi quyền (Admin)
exports.revokeAccess = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập doctorId và patientId'
            });
        }

        const index = accessLogs.findIndex(
            log => log.doctorId === doctorId && log.patientId === patientId && log.status === 'active'
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy quyền truy cập này!'
            });
        }

        // Đánh dấu thu hồi thay vì xóa — giữ lịch sử
        accessLogs[index].status = 'revoked';
        accessLogs[index].revokedAt = new Date();

        return res.status(200).json({
            success: true,
            message: 'Thu hồi quyền truy cập thành công!'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
    }
};
