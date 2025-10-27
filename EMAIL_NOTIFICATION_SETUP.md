# 📧 Hướng dẫn thiết lập Email Notification cho Feedback

## 🎯 **Mục tiêu**
Thiết lập hệ thống tự động gửi email thông báo khi có feedback mới từ người dùng.

## ✅ **Đã hoàn thành**

### 1. **Tạo API Endpoint**
- ✅ Tạo file `api/send-feedback-notification.ts`
- ✅ Sử dụng Resend.com để gửi email
- ✅ Template email đẹp với thông tin đầy đủ

### 2. **Cập nhật Form Feedback**
- ✅ Cập nhật `src/pages/Feedback.tsx`
- ✅ Thêm logic gọi API notification sau khi lưu feedback
- ✅ Xử lý lỗi gracefully (không ảnh hưởng đến UX)

### 3. **Cập nhật Environment Variables**
- ✅ Cập nhật `ENVIRONMENT_VARIABLES.md`
- ✅ Hướng dẫn cấu hình biến môi trường mới

## 🔧 **Cần làm tiếp**

### **Bước 1: Đăng ký Resend.com**
1. Truy cập [resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí
3. Tạo API key mới
4. Verify domain (tùy chọn, có thể dùng domain mặc định)

### **Bước 2: Cấu hình Vercel**
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm các biến môi trường:
   ```
   RESEND_API_KEY = re_xxxxxxxxxxxxx
   NOTIFICATION_EMAIL = your_email@example.com
   ```

### **Bước 3: Deploy**
1. Push code lên GitHub
2. Vercel sẽ tự động deploy
3. Test hệ thống bằng cách gửi feedback

## 📋 **Luồng hoạt động**

```
Người dùng gửi feedback
    ↓
Lưu vào Supabase database
    ↓
Gọi API /api/send-feedback-notification
    ↓
Gửi email thông báo đến NOTIFICATION_EMAIL
    ↓
Bạn nhận được email với thông tin feedback
```

## 📧 **Nội dung email sẽ bao gồm:**
- ⭐ Đánh giá (1-5 sao)
- 📧 Email người gửi (nếu có)
- 🌐 Ngôn ngữ
- 📅 Thời gian gửi
- 📝 Nội dung feedback chi tiết

## 🚨 **Lưu ý quan trọng:**
- Email notification sẽ không ảnh hưởng đến việc lưu feedback
- Nếu API notification lỗi, feedback vẫn được lưu thành công
- Có thể thay đổi email nhận thông báo qua biến `NOTIFICATION_EMAIL`

## 🎉 **Kết quả:**
Sau khi hoàn thành, bạn sẽ nhận được email mỗi khi có người gửi feedback về trang web!
