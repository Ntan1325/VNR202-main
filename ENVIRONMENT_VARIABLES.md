# Biến môi trường cần thiết cho Vercel

## Các biến môi trường cần cấu hình trên Vercel:

1. **VITE_GEMINI_API_KEY** - API key của Google Gemini AI
2. **VITE_GEMINI_MODEL** - Model Gemini (mặc định: gemini-2.5-flash)
3. **VITE_SUPABASE_URL** - URL của Supabase project
4. **VITE_SUPABASE_ANON_KEY** - Anonymous key của Supabase

## Cách cấu hình trên Vercel:

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào Settings > Environment Variables
4. Thêm từng biến với giá trị tương ứng
5. Đảm bảo chọn "Production", "Preview", và "Development"

## Lưu ý:
- Tất cả biến môi trường phải bắt đầu bằng `VITE_` để Vite có thể truy cập
- Không commit file `.env` vào Git repository
- Các biến này sẽ được sử dụng trong quá trình build
