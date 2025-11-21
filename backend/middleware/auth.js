import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // Lấy token từ header
    const { token } = req.headers;

    // 1. Kiểm tra nếu không có token
    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        // 2. Giải mã token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gán ID vào request để dùng ở bước sau
        req.body.userId = token_decode.id;
        next();

    } catch (error) {
        // 3. Bắt lỗi (jwt malformed, token expired, v.v...)
        console.log("JWT Verification Error:", error.message); // Chỉ in thông báo lỗi ngắn gọn
        
        // Trả về lỗi cho Frontend thay vì làm sập server
        return res.json({ success: false, message: "Error: Invalid Token" });
    }
}

export default authMiddleware;