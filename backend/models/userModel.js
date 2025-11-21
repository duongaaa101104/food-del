import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartData: {type: Object, default: {}},
    
    // ----------------------------------------------------
    // --- TRƯỜNG QUẢN LÝ XÁC THỰC (MỚI) ---
    isVerified: { type: Boolean, default: false }, // Trạng thái kích hoạt
    otp: { type: String, default: '' },            // Lưu mã OTP
    otp_expiry: { type: Date }                     // Lưu thời gian hết hạn
    // -------------------------
    
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;