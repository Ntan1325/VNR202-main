````markdown
# 🌟 Ho Chi Minh Ideology Learning Platform
> 📚 Nền tảng học tập số về **tư tưởng Hồ Chí Minh** kết hợp nội dung đa phương tiện, quiz tương tác và trợ lý AI.  
> 🚀 Xây dựng với **React + TypeScript trên Vite**, tối ưu cho desktop & mobile, hỗ trợ **đa ngôn ngữ (🇻🇳/🇬🇧)** và **dark mode**.
---
## 🛠️ Công nghệ chính
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=fff)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=fff)  
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=fff)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)
![Groq API](https://img.shields.io/badge/Groq-FF6B6B?logo=graphql&logoColor=fff)
---
## ✨ Tính năng nổi bật
- 🎬 **Trang chủ điện ảnh** với slideshow, particle effect & thống kê động.
- 📖 **Danh mục chương/bài**: tìm kiếm, lọc, gắn thẻ, điều hướng sâu.
- 📝 **Trình đọc Markdown**: highlight, thanh tiến độ, text-to-speech.
- 🎯 **Quiz đa chương**: chọn bài, chấm điểm tức thì, lưu tiến trình.
- 🤖 **Trợ lý học tập AI**: Groq Chat API (LLaMA 3.1 8B).
- 📨 **Biểu mẫu phản hồi**: kết nối Supabase, xác thực dữ liệu.
- 🌍 **Đa ngôn ngữ & dark mode**: lưu cấu hình trong `localStorage`.
- 👥 **Trang About**: thông tin nhóm, QR code, version auto-update.
---
## 📂 Cấu trúc thư mục
```text
project/
├─ public/              # Ảnh, QR code, cấu hình SPA (_redirects)
├─ src/
│  ├─ components/       # Header, Footer, Hero, Sections, tiện ích
│  ├─ contexts/         # ThemeContext dark/light mode
│  ├─ data/             # JSON: chapters, articles, quizzes
│  ├─ i18n/             # Config dịch song ngữ
│  ├─ lib/              # Supabase & Groq API client
│  ├─ pages/            # Home, Chapters, Article, Quiz, Chat, Feedback, About
│  ├─ utils/            # Markdown utils, system info
│  ├─ App.tsx           # Bố cục tổng thể
│  └─ main.tsx          # Điểm vào ứng dụng React
└─ ...
````
---
## ⚙️ Cài đặt & chạy thử
```bash
# 1. Cài Node.js 18+
# 2. Cài dependencies
npm install
# 3. Chạy dev server
npm run dev
```
Ứng dụng sẽ chạy tại: 👉 `http://localhost:5173`

### 🔑 Biến môi trường `.env`
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GROQ_API_KEY=your-groq-api-key # optional
```
> ⚠️ Không commit key thật lên GitHub!
---
## 📜 Lệnh npm hữu ích
* `npm run dev` – khởi chạy dev server
* `npm run build` – build sản phẩm tĩnh
* `npm run preview` – chạy thử bản build
* `npm run lint` – lint code
* `npm run typecheck` – kiểm tra TypeScript
---
## 🔗 Tích hợp dịch vụ ngoài
### 💾 Supabase (lưu phản hồi)
* Tạo bảng `feedback` với schema: `id`, `created_at`, `rating`, `feedback`, `email`, `language`.
* Lấy `URL` & `anon key` đưa vào `.env`.
### 🤖 Groq Chat API (AI Assistant)
* Đăng ký tại [console.groq.com](https://console.groq.com/)
* Key API → `.env`
* Mặc định: `llama-3.1-8b-instant`
---
## 🌍 Trải nghiệm người dùng
* 🌓 Dark/Light mode lưu trong `localStorage`.
* 🌐 Hỗ trợ 🇻🇳 / 🇬🇧.
* 🔊 Text-to-Speech: Web Speech API (`vi-VN` / `en-US`).
---
## 🚀 Triển khai
* Build SPA: `npm run build`
* Dùng file `public/_redirects` cho Netlify/Vercel để route đúng.
---
## 🧩 Định hướng phát triển
* ✅ Unit test cho quiz & markdown utils.
* ✅ Quản lý nội dung qua CMS/Supabase.
* ✅ Lưu lịch sử chat & quiz theo user.
* ✅ PWA hỗ trợ offline.
---
## 👥 Nhóm thực hiện
Xem chi tiết tại trang **About** (`/about`).
---
## 📞 Liên hệ & hỗ trợ
* 📧 Email: `huyhanhoppo@gmail.com`
* 📱 Điện thoại: `(84) 962 418 452`
* 🌐 Facebook: **Ho Chi Minh Ideology Vietnam**
---
⭐ Nếu dự án hữu ích, hãy **star repo** để ủng hộ nhé!
```
