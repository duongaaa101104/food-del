import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  // Hàm lấy danh sách đơn hàng
  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Lỗi khi tải đơn hàng");
    }
  }

  // Hàm cập nhật trạng thái
  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
      toast.success("Cập nhật trạng thái thành công!");
    }
  }

  // --- MỚI: Hàm xóa đơn hàng ---
  const deleteOrderHandler = async (orderId) => {
    // 1. Hỏi xác nhận trước khi xóa để tránh click nhầm
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này vĩnh viễn không?");
    
    if (confirmDelete) {
      try {
        // 2. Gọi API xóa (Cần đảm bảo Backend có route này)
        const response = await axios.post(url + "/api/order/remove", { orderId });
        
        if (response.data.success) {
          toast.success("Đã xóa đơn hàng!");
          await fetchAllOrders(); // Tải lại danh sách
        } else {
          toast.error("Không thể xóa đơn hàng này.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối đến server.");
      }
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Logic lọc
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "All") return true;
    return order.status === statusFilter;
  });

  return (
    <div className='order add'>
      <h3>Trang đặt hàng</h3>
      
      {/* Thanh lọc trạng thái */}
      <div className="filter-container" style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Lọc theo trạng thái:</label>
        <select 
          onChange={(e) => setStatusFilter(e.target.value)} 
          value={statusFilter}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="All">Tất cả đơn hàng</option>
          <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
          <option value="Đang Chuẩn Bị">Đang Chuẩn Bị</option>
          <option value="Đang Giao">Đang Giao</option>
          <option value="Đã Giao">Đã Giao</option>
          <option value="Đã Hủy">Đã Hủy</option>
        </select>
      </div>

      <div className="order-list">
        {filteredOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            
            {/* Khu vực chứa Select và nút Xóa */}
            <div className='order-actions' style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <select 
                  onChange={(event) => statusHandler(event, order._id)} 
                  value={order.status}
                  className='status-select'
                >
                  <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
                  <option value="Đang Chuẩn Bị">Đang Chuẩn Bị</option>
                  <option value="Đang Giao">Đang Giao</option>
                  <option value="Đã Giao">Đã Giao</option>
                  <option value="Đã Hủy">Đã Hủy</option>
                </select>

                {/* --- MỚI: Nút Xóa --- */}
                <button 
                    onClick={() => deleteOrderHandler(order._id)}
                    className='delete-btn'
                >
                    Xóa đơn
                </button>
            </div>
          </div>
        ))}
      </div>
      {filteredOrders.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Không có đơn hàng nào.
        </p>
      )}
    </div>
  )
}

export default Orders