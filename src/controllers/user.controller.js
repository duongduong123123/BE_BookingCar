const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// POST /api/admins  (tạo admin mới)
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra trùng username
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
        }

        // Tạo admin
        const newUser = new User({ username, password, isAdmin: true });
        await newUser.save();

        return res.status(201).json({
            message: "Tạo quản trị viên thành công",
            user: {
                id: newUser._id,
                username: newUser.username,
                isAdmin: newUser.isAdmin,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

// POST /api/admins/login  (đăng nhập admin)
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        if (!user.isAdmin) {
            return res.status(403).json({ message: "Từ chối truy cập: không phải quản trị viên" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không hợp lệ" });


        const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        return res.status(200).json({
            message: "Đăng nhập quản trị viên thành công",
            token,
            user: {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
};
