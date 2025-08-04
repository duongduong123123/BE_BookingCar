// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { createAdmin } = require("../controllers/user.controller");

// Tạo admin mới
router.post("/", createAdmin);


module.exports = router;
