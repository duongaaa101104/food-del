import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// --- CẤU HÌNH NODEMAILER ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- HÀM PHỤ TRỢ: GỬI OTP ---
const sendOTP = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Food App Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mã Xác thực Đăng ký (OTP)",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Xác thực tài khoản</h2>
                    <p>Cảm ơn bạn đã đăng ký. Mã OTP xác thực của bạn là:</p>
                    <h1 style="color: #ff6347; letter-spacing: 5px;">${otp}</h1>
                    <p>Mã này sẽ hết hạn trong 5 phút.</p>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error("Lỗi gửi mail:", error);
        return false;
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ============================================================
// 1. API ĐĂNG KÝ (Sửa đổi: Lưu user & Gửi OTP, chưa cấp Token)
// ============================================================
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Kiểm tra user tồn tại
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email đã tồn tại trong hệ thống." });
        }

        // Validate dữ liệu
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email không hợp lệ." });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự." });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút

        // Tạo User mới (Lưu ý: isVerified mặc định là false)
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            otp: otpCode,             // Lưu OTP
            otp_expiry: expiryTime,   // Lưu thời gian hết hạn
            isVerified: false         // QUAN TRỌNG: Đánh dấu chưa xác thực
        });

        const user = await newUser.save();

        // Gửi Email OTP
        const emailSent = await sendOTP(email, otpCode);

        if (!emailSent) {
            // Nếu gửi mail lỗi, có thể xóa user vừa tạo để họ đăng ký lại (tùy chọn)
            await userModel.findByIdAndDelete(user._id);
            return res.json({ success: false, message: "Lỗi gửi email xác thực. Vui lòng thử lại." });
        }

        // Trả về success để Frontend chuyển sang màn hình nhập OTP
        res.json({ success: true, message: "Đăng ký bước 1 thành công. Vui lòng kiểm tra email." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi đăng ký" });
    }
}

// ============================================================
// 2. API XÁC THỰC OTP (Dùng để kích hoạt tài khoản sau đăng ký)
// ============================================================
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // Nếu tài khoản đã xác thực rồi thì không cần làm gì (hoặc báo lỗi)
        if (user.isVerified) {
            return res.json({ success: false, message: "Tài khoản này đã được xác thực trước đó." });
        }

        // Kiểm tra OTP
        if (user.otp !== otp) {
            return res.json({ success: false, message: "Mã OTP không chính xác." });
        }

        // Kiểm tra hạn sử dụng OTP
        if (new Date() > user.otp_expiry) {
            return res.json({ success: false, message: "Mã OTP đã hết hạn." });
        }

        // --- THÀNH CÔNG: KÍCH HOẠT TÀI KHOẢN ---
        user.isVerified = true;
        user.otp = undefined;       // Xóa OTP
        user.otp_expiry = undefined;
        await user.save();

        // Cấp Token đăng nhập luôn
        const token = createToken(user._id);
        res.json({ success: true, token, message: "Xác thực thành công! Đăng nhập hoàn tất." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi xác thực OTP" });
    }
}

// ============================================================
// 3. API ĐĂNG NHẬP (Đơn giản hóa: Chỉ check Pass, không OTP)
// ============================================================
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Tài khoản không tồn tại." });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Sai mật khẩu." });
        }

        // KIỂM TRA XEM TÀI KHOẢN ĐÃ KÍCH HOẠT CHƯA?
        // (Nếu user đăng ký xong mà chưa nhập OTP thì không cho đăng nhập)
        if (user.isVerified === false) {
            return res.json({ success: false, message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email." });
        }

        // Đăng nhập thành công -> Cấp token ngay
        const token = createToken(user._id);
        res.json({ success: true, token, message: "Đăng nhập thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server khi đăng nhập" });
    }
}

// ============================================================
// 4. API GỬI LẠI MÃ OTP (Bổ sung cho nút "Gửi lại mã")
// ============================================================
const resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email không tồn tại." });
        }
        if (user.isVerified) {
             return res.json({ success: false, message: "Tài khoản đã xác thực, không cần gửi lại." });
        }

        // Tạo OTP mới
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otpCode;
        user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendOTP(email, otpCode);
        res.json({ success: true, message: "Mã OTP mới đã được gửi." });

    } catch (error) {
        res.json({ success: false, message: "Lỗi Server." });
    }
}

export { loginUser, registerUser, verifyOTP, resendOTP }