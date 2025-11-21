import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContext)

    // --- STATE QUẢN LÝ ---
    const [currState, setCurrState] = useState("Login") // "Login" hoặc "Sign Up"
    const [authStep, setAuthStep] = useState("Credentials"); // "Credentials" hoặc "VerifyOTP"
    const [loading, setLoading] = useState(false); 

    // --- DỮ LIỆU FORM ---
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [otp, setOtp] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({ ...data, [name]: value });
    }

    // --- 1. XỬ LÝ FORM NHẬP THÔNG TIN (ĐĂNG NHẬP / ĐĂNG KÝ) ---
    const onSubmitForm = async (event) => {
        event.preventDefault()
        setLoading(true);
        let newUrl = url;

        if (currState === "Login") {
            // --- XỬ LÝ ĐĂNG NHẬP ---
            newUrl += "/api/user/login"
            try {
                const response = await axios.post(newUrl, data);
                if (response.data.success) {
                    // Đăng nhập thành công -> Lưu token luôn (Không cần OTP)
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    setShowLogin(false);
                    alert("Đăng nhập thành công!");
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert("Lỗi đăng nhập. Vui lòng kiểm tra lại.");
            } finally {
                setLoading(false);
            }

        } else {
            // --- XỬ LÝ ĐĂNG KÝ ---
            newUrl += "/api/user/register"
            try {
                const response = await axios.post(newUrl, data);
                if (response.data.success) {
                    // Đăng ký bước 1 thành công -> Chuyển sang nhập OTP
                    setAuthStep("VerifyOTP");
                    alert("Mã xác thực đã được gửi đến email đăng ký. Vui lòng kiểm tra.");
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert("Lỗi đăng ký. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
    }

    // --- 2. XỬ LÝ XÁC THỰC OTP (CHỈ DÙNG CHO ĐĂNG KÝ) ---
    const onVerifyOTP = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Endpoint này dùng để verify email sau khi đăng ký
            const verifyResponse = await axios.post(url + "/api/user/verifyOTP", {
                email: data.email,
                otp: otp
            });

            if (verifyResponse.data.success) {
                // Xác thực OTP thành công -> Đăng ký hoàn tất -> Cấp token
                setToken(verifyResponse.data.token);
                localStorage.setItem("token", verifyResponse.data.token);
                setShowLogin(false);
                alert("Đăng ký tài khoản thành công!");
            } else {
                alert(verifyResponse.data.message || "Mã OTP không đúng.");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi xác thực OTP.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-popup'>
            
            {/* MÀN HÌNH 1: NHẬP THÔNG TIN (EMAIL/PASS) */}
            {authStep === "Credentials" && (
                <form onSubmit={onSubmitForm} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currState === "Sign Up" ? "Đăng ký" : "Đăng nhập"}</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    </div>
                    
                    <div className="login-popup-inputs">
                        {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Tên hiển thị' required />}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Địa chỉ email' required />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Mật khẩu' required />
                    </div>

                    <button type='submit' disabled={loading}>
                        {loading ? "Đang xử lý..." : (currState === "Sign Up" ? "Tiếp tục" : "Đăng nhập")}
                    </button>

                    <div className="login-popup-condition">
                        <input type="checkbox" required/>
                        <p>Tôi đồng ý với các điều khoản sử dụng & chính sách bảo mật.</p>
                    </div>

                    {currState === "Login"
                    ? <p>Chưa có tài khoản? <span onClick={() => setCurrState("Sign Up")}>Đăng ký ngay</span></p>
                    : <p>Bạn đã có tài khoản? <span onClick={() => setCurrState("Login")}>Đăng nhập tại đây</span></p>
                    }
                </form>
            )}

            {/* MÀN HÌNH 2: NHẬP OTP (CHỈ HIỆN KHI ĐĂNG KÝ XONG BƯỚC 1) */}
            {authStep === "VerifyOTP" && (
                <form onSubmit={onVerifyOTP} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>Xác thực Email</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <div className="login-popup-inputs">
                        <p>Nhập mã OTP gửi về <b>{data.email}</b> để hoàn tất đăng ký.</p>
                        <input
                            name='otp'
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            type="text"
                            placeholder='Nhập mã OTP'
                            required
                            maxLength={6}
                            style={{textAlign: 'center', fontSize: '18px', letterSpacing: '2px'}}
                        />
                    </div>
                    
                    <button type='submit' disabled={loading}>
                        {loading ? "Đang kích hoạt..." : "Hoàn tất đăng ký"}
                    </button>

                    <p style={{cursor: 'pointer', color: 'tomato'}} onClick={() => setAuthStep("Credentials")}>
                        Quay lại
                    </p>
                </form>
            )}
        </div>
    )
}

export default LoginPopup