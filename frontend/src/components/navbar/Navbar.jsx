import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  
  // 1. Lấy setSearchValue từ Context
  const { getTotalCartAmount, token, setToken, setSearchValue } = useContext(StoreContext);
  
  const navigation = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigation('/');
  }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Trang chủ</li>
        <li onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Thực đơn</li>
        <li onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Ứng dụng</li>
        <a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Liên hệ</a>
      </ul>
      
      <div className="navbar-right">
        
        {/* --- 2. PHẦN TÌM KIẾM MỚI --- */}
        <div className="navbar-search-container">
            <input 
                type="text" 
                placeholder="Tìm món ăn..." 
                onChange={(e) => setSearchValue(e.target.value)} 
            />
            <img src={assets.search_icon} alt="" className="search-icon"/>
        </div>
        {/* --------------------------- */}

        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        
        {!token ? <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigation('/myorders')} ><img src={assets.bag_icon} alt="" /><p>Đơn Hàng</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Đăng xuất</p></li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar