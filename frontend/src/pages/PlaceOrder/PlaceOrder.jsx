import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// --- CẤU HÌNH TÀI KHOẢN NHẬN TIỀN (VIETQR) ---
const MY_BANK = {
    BANK_ID: "TPBANK",         // Mã ngân hàng (MB, VCB, TCB, VPB...)
    ACCOUNT_NO: "00000909078", // Số tài khoản của bạn
    ACCOUNT_NAME: "NGUYEN XUAN DUONG", // Tên chủ tài khoản (Tuỳ chọn hiển thị)
    TEMPLATE: "compact2"   // Giao diện mã QR
}

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

    // State quản lý
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState("cod"); // Mặc định là COD
    const [showQR, setShowQR] = useState(false);   // State hiện Popup QR
    
    const navigate = useNavigate();

    // Form dữ liệu
    const [data, setData] = useState({
        firstName: "", lastName: "", email: "", street: "",
        city: "", state: "", zipcode: "", country: "", phone: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    // --- HÀM TẠO LINK ẢNH QR CODE (Tự động tính tiền) ---
    // Quy đổi tỉ giá: Ví dụ 1$ = 25,000 VND. Nếu web bạn dùng VND sẵn thì bỏ "* 25000"
    const totalAmountVND = (getTotalCartAmount() + 2) * 25000; 
    const qrCodeUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-${MY_BANK.TEMPLATE}.png?amount=${totalAmountVND}&addInfo=THANHTOAN DON HANG&accountName=${MY_BANK.ACCOUNT_NAME}`;

    // --- XỬ LÝ ĐẶT HÀNG ---
    const placeOrder = async (event) => {
        event.preventDefault();
        setLoading(true); // Bắt đầu Loading

        try {
            // 1. Chuẩn bị dữ liệu đơn hàng
            let orderItems = [];
            food_list.map((item) => {
                if (cartItems[item._id] > 0) {
                    let itemInfo = { ...item };
                    itemInfo['quantity'] = cartItems[item._id];
                    orderItems.push(itemInfo);
                }
                return item;
            })

            let orderData = {
                address: data,
                items: orderItems,
                amount: getTotalCartAmount() + 2, // Tổng tiền + Phí ship
                paymentMethod: payment            // Gửi phương thức thanh toán lên server
            }

            // 2. Gọi API tạo đơn hàng
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

            if (response.data.success) {
                // --- PHÂN LOẠI HÀNH ĐỘNG THEO PHƯƠNG THỨC THANH TOÁN ---
                
                if (payment === "stripe") {
                    // a. Nếu là Stripe -> Chuyển hướng sang trang thanh toán
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                } 
                else if (payment === "qr") {
                    // b. Nếu là QR -> Tắt loading form, Mở Popup QR
                    setLoading(false); 
                    setShowQR(true);
                } 
                else {
                    // c. Nếu là COD -> Chuyển về trang đơn hàng
                    // alert("Đặt hàng thành công!"); // Có thể bỏ alert cho mượt
                    navigate("/myorders");
                }
            } else {
                alert("Lỗi đặt hàng: " + response.data.message);
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối hệ thống!");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token || getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <>
            <form onSubmit={placeOrder} className='place-order'>
                <div className='place-order-left'>
                    <p className="title">Thông tin giao hàng</p>
                    <div className="multi-fields">
                        <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Họ' />
                        <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Tên' />
                    </div>
                    <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                    <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Số nhà, Tên đường' />
                    <div className="multi-fields">
                        <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Thành phố' />
                        <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Quận/Huyện' />
                    </div>
                    
                    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' />
                </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Tổng đơn hàng</h2>
                        <div className="cart-total-details">
                            <p>Tiền hàng</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí vận chuyển</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng thanh toán</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>

                        {/* --- LỰA CHỌN PHƯƠNG THỨC THANH TOÁN --- */}
                        <div className="payment-options">
                            <h3>Chọn phương thức thanh toán</h3>
                            
                            {/* 1. COD */}
                            <div onClick={() => setPayment("cod")} className={`payment-option ${payment === "cod" ? "selected" : ""}`}>
                                <div className="dot-select"></div>
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </div>

                            {/* 2. QR Code */}
                            <div onClick={() => setPayment("qr")} className={`payment-option ${payment === "qr" ? "selected" : ""}`}>
                                <div className="dot-select"></div>
                                <span>Chuyển khoản ngân hàng (QR Code)</span>
                            </div>

                            {/* 3. Stripe */}
                            <div onClick={() => setPayment("stripe")} className={`payment-option ${payment === "stripe" ? "selected" : ""}`}>
                                <div className="dot-select"></div>
                                <span>Thẻ Tín dụng / Quốc tế (Stripe)</span>
                            </div>
                        </div>

                        <button type='submit' disabled={loading} style={{opacity: loading ? 0.7 : 1}}>
                            {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                        </button>
                    </div>
                </div>
            </form>

            {/* --- POPUP HIỂN THỊ QR CODE (Chỉ hiện khi showQR = true) --- */}
            {showQR && (
                <div className="qr-popup-overlay">
                    <div className="qr-popup-container">
                        <h3>Quét mã để thanh toán</h3>
                        <p>Vui lòng sử dụng App Ngân hàng để quét mã</p>
                        
                        {/* Ảnh QR được tạo tự động */}
                        <img src={qrCodeUrl} alt="QR Code Payment" className="qr-image" />
                        
                        <div className="qr-info">
                            <p>Số tiền: <b>{totalAmountVND.toLocaleString()} VND</b></p>
                            <p>Nội dung: <b>THANHTOAN DON HANG</b></p>
                        </div>

                        <div className="qr-buttons">
                            <button className="btn-confirm" onClick={() => { setShowQR(false); navigate('/myorders'); }}>
                                Tôi đã chuyển khoản
                            </button>
                            <button className="btn-close" onClick={() => setShowQR(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PlaceOrder