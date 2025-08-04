const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Bạn chưa đăng nhập hoặc thiếu token truy cập." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Truy cập bị từ chối: tài khoản không có quyền admin." });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn.",
            error: err.message,
        });
    }
};
