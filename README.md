# 🍔 FOOD DELIVER – Website Giao Đồ Ăn Trực Tuyến

## 👥 Nhóm Thực Hiện
| Họ và tên | MSSV |
|------------|--------|
| Nguyễn Xuân Dương | 22810310396 |
| Hồ Đức Thắng | 22810310404 |
| Đồng Viết Minh | 22810310393 |

---

## 🧩 Tổng Quan Dự Án

**Food Deliver** là website giao đồ ăn trực tuyến, cung cấp trải nghiệm đặt món nhanh, tiện lợi và an toàn.  
Hệ thống gồm hai phần:
- **Frontend**: Giao diện người dùng và trang quản trị.
- **Backend**: Xử lý logic nghiệp vụ, API và kết nối cơ sở dữ liệu.

---

## 🚀 Công Nghệ Sử Dụng

### 🖥️ Frontend
- **React + Vite**
- **React Router DOM**
- **React Context API** (quản lý giỏ hàng)
- **Axios**
- **TailwindCSS** (giao diện responsive)
  
### ⚙️ Backend
- **Node.js + Express**
- **MongoDB Atlas + Mongoose**
- **JWT** (xác thực người dùng)
- **bcryptjs** (mã hóa mật khẩu)
- **Stripe API** (tích hợp thanh toán)

---

## 🌟 Tính Năng Chính

### 👨‍🍳 Giao Diện Người Dùng
- **Trang chủ:** Hiển thị danh sách món ăn, lọc theo danh mục (*Dessert*, *Noodles*, …).
- **Responsive:** Hiển thị đẹp trên mọi thiết bị (PC, tablet, mobile).
- **Đăng ký / Đăng nhập:** Kiểm tra độ mạnh mật khẩu, xác thực bằng JWT.
- **Giỏ hàng:** Thêm, tăng/giảm số lượng, xóa món ăn.
- **Thanh toán:** 
  - Nhập thông tin giao hàng (tên, địa chỉ, số điện thoại).  
  - Thanh toán an toàn qua **Stripe**.
- **Đơn hàng của tôi:** Xem lịch sử và trạng thái đơn hàng (*Đang xử lý*, *Đang giao*, *Đã giao*).

### 🧑‍💼 Trang Quản Trị (Admin Panel)
- **Quản lý đơn hàng:** Xem toàn bộ đơn từ người dùng.
- **Cập nhật trạng thái:** Thay đổi trạng thái đơn hàng (ví dụ: *Đang giao*, *Hoàn tất*).
- **Quản lý món ăn:**
  - Thêm món mới (tên, mô tả, giá, ảnh, danh mục).
  - Xóa / sửa món ăn.

---

## 🏗️ Cấu Trúc Hệ Thống

