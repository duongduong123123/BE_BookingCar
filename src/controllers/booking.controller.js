const Booking = require("../models/booking.model");
const ExcelJS = require("exceljs");

// [POST] /booking/create-booking
exports.createBooking = async (req, res) => {
    const {
        fullName,
        phone,
        pickupLocation,
        destinationLocation,
        scheduledTime,
        luggage,
    } = req.body;

    // Kiểm tra field bắt buộc
    if (!fullName || !phone || !pickupLocation || !destinationLocation || !scheduledTime) {
        return res.status(400).json({
            message: "Vui lòng điền đầy đủ các thông tin bắt buộc.",
            requiredFields: ["fullName", "phone", "pickupLocation", "destinationLocation", "scheduledTime"]
        });
    }

    try {
        const newBooking = new Booking({
            fullName,
            phone,
            pickupLocation,
            destinationLocation,
            scheduledTime,
            luggage,
        });

        const saved = await newBooking.save();


        res.status(201).json({
            message: "Đặt chỗ thành công.",
            booking: saved,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo booking.",
            error: error.message,
        });
    }
};


// [GET] /booking (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                message: "Không có booking nào trong hệ thống.",
                count: 0,
                bookings: [],
            });
        }

        res.status(200).json({
            message: `Lấy danh sách thành công: ${bookings.length} booking.`,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy danh sách booking.",
            error: error.message,
        });
    }
};


// [GET] /booking/export (admin only)
exports.exportBookingsToExcel = async (req, res) => {
    try {
        const { date } = req.query;
        let filter = {};

        // Chỉ lọc theo ngày nếu date đúng định dạng "YYYY-MM-DD"
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [yyyy, mm, dd] = date.split('-').map(Number);
            const start = new Date(yyyy, mm - 1, dd);
            const end = new Date(yyyy, mm - 1, dd + 1);
            filter = { scheduledTime: { $gte: start, $lt: end } };
        }

        // Lấy dữ liệu booking theo filter
        const bookings = await Booking.find(filter);

        // Tạo workbook + worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');

        // Định nghĩa cột và in đậm header
        worksheet.columns = [
            { header: 'STT', key: 'index', width: 6 },
            { header: 'Họ tên', key: 'fullName', width: 20 },
            { header: 'SĐT', key: 'phone', width: 15 },
            { header: 'Điểm đón', key: 'pickupLocation', width: 20 },
            { header: 'Điểm đến', key: 'destinationLocation', width: 20 },
            { header: 'Ngày', key: 'date', width: 12 },
            { header: 'Giờ', key: 'time', width: 8 },
            { header: 'Hành lý', key: 'luggage', width: 10 },
            { header: 'Thời gian tạo', key: 'createdAtFormatted', width: 25 },
        ];
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        // Đổ dữ liệu vào worksheet
        bookings.forEach((b, i) => {
            const sched = new Date(b.scheduledTime);
            const created = new Date(b.createdAt);
            worksheet.addRow({
                index: i + 1,
                fullName: b.fullName,
                phone: b.phone,
                pickupLocation: b.pickupLocation,
                destinationLocation: b.destinationLocation,
                date: sched.toLocaleDateString('vi-VN'),
                time: sched.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                luggage: b.luggage,
                createdAtFormatted:
                    `${created.toLocaleDateString('vi-VN')} lúc ` +
                    `${created.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}`
            });
        });

        // Sinh tên file: nếu có date thì dùng định dạng DD-MM-YYYY, nếu không thì là "bookings"
        let baseName = 'bookings';
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [yyyy, mm, dd] = date.split('-');
            baseName += `_${dd}-${mm}-${yyyy}`;
        }
        const fileName = `${baseName}.xlsx`;
        const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`;

        // **Thêm dòng này để client có thể đọc header Content-Disposition**
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        // Thiết lập header và gửi file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', disposition);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Lỗi khi xuất file Excel:', err);
        res.status(500).json({
            message: 'Xuất file thất bại, vui lòng thử lại sau',
            error: err.message
        });
    }
};