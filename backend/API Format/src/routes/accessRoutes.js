const express = require('express');
const router = express.Router();
const { xacThucToken, phanQuyen } = require('../middleware/authMiddleware');
const { grantAccess } = require('../controllers/accessController');

// POST /api/v1/access/grant
// Cấp quyền truy cập hồ sơ bệnh nhân — chỉ Doctor
router.post('/grant', xacThucToken, phanQuyen('doctor'), grantAccess);

module.exports = router;
