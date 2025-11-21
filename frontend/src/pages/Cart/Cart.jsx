import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
const Cart = () => {

  const { cartItems, food_list, removeFromCart,getTotalCartAmount,url } = useContext(StoreContext);
  const navigate = useNavigate()
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Ảnh minh họa</p>
          <p>Tên</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>X</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div className="cart-total-details">
            <p>Tổng sản phẩm</p>
            <p>{getTotalCartAmount()}</p>
            <hr />
          </div>
          <div className="cart-total-details">
            <p>Phí giao hàng</p>
            <p>${getTotalCartAmount()===0?0:2}</p>
            <hr />
          </div>
          <div className="cart-total-details">
            <b>Tổng thanh toán</b>
            <b>{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>


          </div>
          <button onClick={()=>navigate('/order')}>Xác nhận</button>
        </div>
        
        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã khuyến mãi. Nhập vào đây</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='mã ' />
              <button>Kiểm tra</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart