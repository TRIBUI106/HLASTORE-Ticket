# 🎫 HeLa Store Ticket Bot

**Bot Discord hỗ trợ quản lý ticket cho cửa hàng HeLa** với giao diện đẹp, thao tác mượt mà và tính năng tự động xử lý khi kho ticket đầy. Bot được thiết kế để hỗ trợ người dùng tạo ticket mua hàng hoặc hỗ trợ/bảo hành, cùng với các chức năng khóa, mở khóa, và đóng ticket.

---

## 🌟 Tính năng nổi bật

- **Tạo ticket dễ dàng** 🛒: Người dùng nhấn nút, nhập lý do qua modal, và bot tự động tạo kênh ticket riêng.
- **Quản lý ticket linh hoạt** 🔒:
  - **Khóa**: Ẩn kênh với người tạo ticket.
  - **Mở khóa**: Khôi phục quyền xem/gửi tin nhắn.
  - **Đóng**: Di chuyển ticket vào kho lưu trữ.
- **Tự động xử lý kho đầy** 📂:
  - Khi category `closedTicketCategory` đạt 50 kênh, bot:
    - Tạo category mới với tên `Kho ticket từ DD/MM`.
    - Gửi embed thông báo tới owner (dựa trên `ownerId`).
    - Cập nhật `config.js` và restart bot để áp dụng.
- **Giao diện đẹp mắt** 🎨: Embed với màu sắc bắt mắt, logo, banner, và footer của HeLa Store.
- **Xử lý bất đồng bộ** ⚡: Sử dụng `async/await` để đảm bảo mọi thao tác mượt mà.

---

## 🛠️ Cài đặt

### 1. Yêu cầu
- **Node.js** v16 hoặc cao hơn.
- **Nodemon** để tự động restart khi cấu hình thay đổi.
- **Discord.js** (`npm install discord.js`).
- Quyền đọc/ghi file cho `config.js`.

### 2. Cấu hình
Tạo file `config.js` trong thư mục gốc với nội dung:
```javascript
module.exports = {
  closedTicketCategory: "ID_CUA_CATEGORY_CLOSED_TICKET",
  ticketCategory: "ID_CUA_CATEGORY_TICKET",
  roleSupport: ["ID_ROLE_1", "ID_ROLE_2"],
  ownerId: "ID_CUA_OWNER"
};
```
> **Lưu ý**: Đảm bảo các ID (category, role, owner) là chính xác.

### 3. Cài đặt dependencies
```bash
npm i
```

### 4. Chạy bot
```bash
npm run dev
```
> Giả sử `index.js` là file chính khởi chạy bot.

---

## 🚀 Cách sử dụng

1. **Khởi tạo hệ thống ticket**:
   - Gửi lệnh hoặc sự kiện để gọi `ticketHandler.js`, hiển thị embed với hai nút:
     - 🛒 **Mua hàng**
     - 🏦 **Hỗ trợ / Bảo hành**
   - Người dùng nhấn nút, nhập lý do qua modal, bot tạo kênh ticket.

2. **Quản lý ticket**:
   - Trong kênh ticket, support team có thể:
     - **🔒 Khóa Ticket**: Ẩn kênh với người tạo.
     - **🔓 Mở Khóa**: Khôi phục quyền xem/gửi tin nhắn.
     - **❌ Đóng Ticket**: Chuyển ticket vào `closedTicketCategory`.

3. **Khi kho ticket đầy**:
   - Bot tự động:
     - Tạo category mới (`Kho ticket từ DD/MM`).
     - Gửi embed thông báo tới owner qua DM (dựa trên `ownerId`).
     - Cập nhật `closedTicketCategory` trong `config.js`.
     - Di chuyển ticket vào category mới và restart bot.

---

## ⚠️ Lưu ý
- **Quyền DM**: Owner cần bật DM từ bot để nhận thông báo khi kho đầy.
- **Quyền file**: Đảm bảo bot có quyền đọc/ghi file `config.js`.
- **Debug**: Kiểm tra console log nếu không nhận được embed hoặc lỗi khi ghi file/restart.
- **Tùy chỉnh giao diện**: Có thể tích hợp CSS/JS để thêm animation nếu dùng giao diện web.

---

## 📁 Cấu trúc code
- **`interactionHandler.js`**: Xử lý interaction (nút, modal), quản lý ticket, và logic khi category đầy.
- **`ticketHandler.js`**: Khởi tạo embed và nút để bắt đầu hệ thống ticket.
- **`config.js`**: Lưu trữ ID của category, role support, và owner.

---

## 💌 Liên hệ
Nếu cần thêm tính năng, sửa lỗi, hoặc tích hợp animation cho giao diện web, liên hệ **Bùi Đức Trí** qua Discord!

*Made with 💓 by HeLa Store Team*
