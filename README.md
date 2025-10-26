Trang web  Food Deliver

Nhóm thực hiện 
Thành viên nhóm :
Nguyễn Xuân Dương msv:22810310396
Hồ Đức Thắng      msv:22810310404
Đồng Viết Minh    msv:22810310393


Tổng quan các tính năng của trang web
1. Giao diện người dùng (Frontend):

Trang chủ: Hiển thị danh sách các món ăn. Người dùng có thể lọc món ăn theo danh mục (như "Desert", "Noodles")

Thiết kế Responsive: Trang web tự động điều chỉnh bố cục để hiển thị đẹp mắt trên nhiều kích cỡ màn hình khác nhau, từ máy tính đến điện thoại di động.

Xác thực người dùng: Có chức năng Đăng nhập và Đăng ký. Form đăng ký có kiểm tra độ mạnh của mật khẩu .

Giỏ hàng: Người dùng có thể thêm món ăn vào giỏ, tăng/giảm số lượng hoặc xóa khỏi giỏ hàng .

Quy trình thanh toán:

Người dùng nhập thông tin giao hàng (tên, địa chỉ, số điện thoại).

Chuyển đến trang thanh toán an toàn được tích hợp qua Stripe .

Đơn hàng của tôi: Sau khi thanh toán thành công, người dùng có thể xem lại lịch sử đơn hàng và theo dõi trạng thái của đơn (ví dụ: "Đang xử lý", "Đang giao hàng") .

2. Trang quản trị (Admin Panel):

Quản lý đơn hàng: Admin có thể xem tất cả đơn hàng mới từ người dùng .

Cập nhật trạng thái: Admin có thể thay đổi trạng thái đơn hàng (ví dụ: "Đang giao hàng", "Đã giao"), và người dùng sẽ thấy trạng thái này được cập nhật trên trang "Đơn hàng của tôi" .

Quản lý sản phẩm (Món ăn):

Xem danh sách tất cả các món ăn.

Xóa món ăn khỏi cơ sở dữ liệu.

Thêm món ăn mới, bao gồm tải ảnh lên, nhập tên, mô tả, chọn danh mục và giá tiền .

Tóm tắt quá trình xây dựng
Video hướng dẫn bạn xây dựng toàn bộ dự án từ đầu đến cuối, bao gồm:

Thiết lập Frontend: Dùng React (với Vite) , cài đặt react-router-dom để điều hướng trang .

Xây dựng Components: Tạo các thành phần giao diện như Navbar (thanh điều hướng, Header (đầu trang), Explore Menu (menu khám phá), Food Display (hiển thị món ăn), và Login Popup (cửa sổ đăng nhập).

Quản lý trạng thái: Sử dụng React Context API để quản lý trạng thái chung của ứng dụng, đặc biệt là dữ liệu giỏ hàng .

Thiết lập Backend: Dùng Node.js và Express , kết nối với cơ sở dữ liệu MongoDB Atlas .

Tạo Model & API:

Định nghĩa các cấu trúc dữ liệu (schemas) cho Món ăn (Food) và Người dùng (User) bằng Mongoose,.

Xây dựng các API endpoints để xử lý các chức năng: thêm/xem/xóa món ăn, đăng ký/đăng nhập người dùng, quản lý giỏ hàng  và đặt hàng .

Bảo mật: Triển khai xác thực người dùng bằng JSON Web Token (JWT) và mã hóa mật khẩu bằng bcrypt.

Xây dựng Admin Panel: Tạo một dự án React riêng biệt cho trang Admin, dùng các API đã tạo để quản lý món ăn và đơn hàng.

Tích hợp thanh toán: Kết nối với Stripe API để tạo các phiên thanh toán an toàn .

Hoàn thiện: Xây dựng trang "My Orders"  và logic xác thực thanh toán, cập nhật trạng thái đơn hàng.
