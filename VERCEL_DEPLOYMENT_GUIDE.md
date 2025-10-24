# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Repository

1. **Commit và push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Bước 2: Deploy trên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Truy cập [vercel.com](https://vercel.com)**
2. **Đăng nhập bằng GitHub account**
3. **Click "New Project"**
4. **Import repository từ GitHub:**
   - Chọn repository `VNR202-main`
   - Click "Import"

5. **Cấu hình Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (mặc định)
   - **Build Command:** `npm run build` (mặc định)
   - **Output Directory:** `dist` (mặc định)
   - **Install Command:** `npm install` (mặc định)

6. **Cấu hình Environment Variables:**
   - Click "Environment Variables"
   - Thêm các biến sau:
     ```
     VITE_GEMINI_API_KEY = your_gemini_api_key
     VITE_GEMINI_MODEL = gemini-2.5-flash
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```
   - Chọn "Production", "Preview", và "Development"

7. **Click "Deploy"**

### Cách 2: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login vào Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? `Y`
   - Which scope? Chọn account của bạn
   - Link to existing project? `N`
   - Project name: `vnr202` (hoặc tên bạn muốn)
   - Directory: `./`
   - Override settings? `N`

## Bước 3: Cấu hình Domain (Tùy chọn)

1. **Vào Project Settings > Domains**
2. **Thêm custom domain nếu có**
3. **Cấu hình DNS records theo hướng dẫn**

## Bước 4: Kiểm tra Deploy

1. **Truy cập URL được cung cấp**
2. **Kiểm tra các tính năng:**
   - Navigation giữa các trang
   - Chat AI functionality
   - Feedback form
   - Responsive design

## Troubleshooting

### Lỗi thường gặp:

1. **Build failed:**
   - Kiểm tra environment variables
   - Đảm bảo tất cả dependencies được cài đặt

2. **404 errors khi navigate:**
   - File `vercel.json` đã được tạo để handle SPA routing
   - Đảm bảo file này có trong root directory

3. **API không hoạt động:**
   - Kiểm tra environment variables trên Vercel
   - Đảm bảo API keys hợp lệ

### Performance Optimization:

1. **Code splitting:** Có thể implement dynamic imports để giảm bundle size
2. **Image optimization:** Sử dụng Vercel's Image Optimization
3. **Caching:** Configure caching headers trong `vercel.json`

## Sau khi Deploy

1. **Enable Analytics:** Vào Project Settings > Analytics
2. **Setup Monitoring:** Cấu hình error tracking
3. **Performance Monitoring:** Theo dõi Core Web Vitals

## Auto-deployment

Vercel sẽ tự động deploy khi bạn push code mới lên GitHub branch `main`.
