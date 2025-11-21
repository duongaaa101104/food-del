import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Giao đồ ăn nhanh chóng, đảm bảo chất lượng và an toàn vệ sinh thực phẩm.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>CÔNG TY</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Giao hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>LIÊN LẠC</h2>
          <ul>
            <li>+84-123-456-789</li>
            <li>contact@estella.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Không có gì cảm ơn!</p>
    </div>
  )
}

export default Footer