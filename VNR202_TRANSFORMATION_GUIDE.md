# VNR202 – Lịch sử Đảng Cộng sản Việt Nam
## Website Transformation Guide

This document outlines the complete transformation from HCM202 (Tư tưởng Hồ Chí Minh) to VNR202 (Lịch sử Đảng Cộng sản Việt Nam).

---

## 🎯 Overview

**Previous Course:** HCM202 – Tư tưởng Hồ Chí Minh
**New Course:** VNR202 – Lịch sử Đảng Cộng sản Việt Nam
**Purpose:** Educational course website for Vietnamese university students studying the History of the Communist Party of Vietnam

---

## 📚 Course Structure

### Chương nhập môn
**Đối tượng, chức năng, nhiệm vụ, nội dung và phương pháp nghiên cứu, học tập Lịch sử Đảng Cộng sản Việt Nam**

Topics covered:
1. Đối tượng nghiên cứu của môn học
2. Chức năng, nhiệm vụ của môn học
3. Phương pháp nghiên cứu, học tập môn học
4. Mục đích, yêu cầu của môn học

---

### Chương 1: Đảng Cộng sản Việt Nam ra đời và lãnh đạo đấu tranh giành chính quyền (1930–1945)

**1.1 Đảng Cộng sản Việt Nam ra đời và Cương lĩnh chính trị đầu tiên của Đảng (tháng 2-1930)**
- Bối cảnh lịch sử
- Nguyễn Ái Quốc chuẩn bị các điều kiện để thành lập Đảng
- Thành lập Đảng Cộng sản Việt Nam và Cương lĩnh chính trị đầu tiên
- Ý nghĩa lịch sử của việc thành lập Đảng

**1.2 Đảng lãnh đạo đấu tranh giành chính quyền (1930–1945)**
- Phong trào cách mạng 1930–1931 và khôi phục phong trào 1932–1935
- Phong trào dân chủ 1936–1939
- Phong trào giải phóng dân tộc 1939–1945
- Tính chất, ý nghĩa và kinh nghiệm của Cách mạng Tháng Tám 1945

---

### Chương 2: Đảng lãnh đạo hai cuộc kháng chiến, hoàn thành giải phóng dân tộc, thống nhất đất nước (1945–1975)

**2.1 Đảng lãnh đạo xây dựng, bảo vệ chính quyền và kháng chiến chống Pháp (1945–1954)**
- Xây dựng và bảo vệ chính quyền cách mạng (1945–1946)
- Đường lối kháng chiến toàn quốc và thực hiện (1946–1950)
- Đẩy mạnh cuộc kháng chiến đến thắng lợi (1951–1954)
- Ý nghĩa lịch sử và kinh nghiệm lãnh đạo kháng chiến chống Pháp

**2.2 Lãnh đạo xây dựng CNXH ở miền Bắc và kháng chiến chống Mỹ (1954–1975)**
- Sự lãnh đạo của Đảng đối với cách mạng hai miền Nam–Bắc (1954–1965)
- Lãnh đạo cách mạng cả nước (1965–1975)
- Ý nghĩa lịch sử và kinh nghiệm lãnh đạo thời kỳ 1954–1975

---

### Chương 3: Đảng lãnh đạo cả nước quá độ lên CNXH và tiến hành công cuộc đổi mới (1975–2018)

**3.1 Đảng lãnh đạo xây dựng CNXH và bảo vệ Tổ quốc (1975–1986)**
- Giai đoạn 1975–1981
- Đại hội V và đột phá đổi mới kinh tế (1982–1986)

**3.2 Lãnh đạo công cuộc đổi mới, đẩy mạnh công nghiệp hoá, hiện đại hoá, hội nhập quốc tế (1986–nay)**
- Đổi mới toàn diện, đưa đất nước ra khỏi khủng hoảng (1986–1996)
- Tiếp tục đổi mới, hội nhập quốc tế (1996–nay)

**3.3 Thành tựu và kinh nghiệm**
- Thành tựu và kinh nghiệm của công cuộc đổi mới
- Nguyên nhân và tác hại của tham nhũng
- Tổng kết chương 1–3

---

## 🤖 AI Integration Changes

### Previous Configuration (HCM202)
- **Provider:** Groq API
- **Model:** llama-3.1-8b-instant
- **Focus:** Tư tưởng Hồ Chí Minh
- **Environment Variable:** `VITE_GROQ_API_KEY`

### New Configuration (VNR202)
- **Provider:** Gemini API (Google)
- **Model:** gemini-1.5-flash
- **Focus:** Lịch sử Đảng Cộng sản Việt Nam
- **Environment Variable:** `VITE_GEMINI_API_KEY`

### System Prompt (Vietnamese)
```
Bạn là trợ lý học tập chuyên về môn Lịch sử Đảng Cộng sản Việt Nam (VNR202).
Hãy giải thích, tóm tắt và hỗ trợ người học ôn tập từng chương một cách dễ hiểu,
có ví dụ và câu hỏi luyện tập.
```

### Key Features
1. Explains historical events and Party decisions
2. Summarizes chapters in easy-to-understand language
3. Provides examples and practice questions
4. Maintains political neutrality and academic rigor
5. Only references course materials
6. Declines questions outside the curriculum scope

---

## 🔧 Technical Changes Made

### 1. Content Files Updated
- ✅ `/src/data/chapters.json` - New course structure with 4 chapters
- ✅ `/src/i18n/translations.json` - All UI text updated for VNR202
- ✅ `/index.html` - Metadata, title, and SEO tags updated

### 2. AI Client Implementation
- ✅ `/src/lib/aiClient.ts` - Replaced Groq client with Gemini API client
- ✅ `/src/pages/Chat.tsx` - Updated to use Gemini integration
- ✅ System prompts rewritten for Party History focus

### 3. Environment Configuration
- ✅ `.env` - Added `VITE_GEMINI_API_KEY` placeholder

### 4. Design & Theme
- ✅ Maintained red-white color palette (Communist Party colors)
- ✅ Preserved modern academic design
- ✅ Kept all navigation and layout structure

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
Edit `.env` file and replace the placeholder:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

To get a Gemini API key:
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `.env` file

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📊 Feature Comparison

| Feature | HCM202 (Old) | VNR202 (New) |
|---------|-------------|-------------|
| Course Name | Tư tưởng Hồ Chí Minh | Lịch sử Đảng Cộng sản Việt Nam |
| Chapters | 6 chapters | 4 chapters (+ intro) |
| AI Provider | Groq (Llama) | Google Gemini |
| AI Model | llama-3.1-8b-instant | gemini-1.5-flash |
| Focus | Ho Chi Minh's ideology | Communist Party history |
| Color Theme | Red-white | Red-white (maintained) |
| Language Support | Vietnamese + English | Vietnamese + English |

---

## 🎨 Design Philosophy

The website maintains a professional academic aesthetic appropriate for university-level political history education:

- **Color Palette:** Red and white symbolizing the Communist Party's historical values
- **Typography:** Clear, readable fonts with proper hierarchy
- **Layout:** Modern, responsive design with mobile-first approach
- **Interactions:** Smooth animations and transitions
- **Accessibility:** High contrast ratios and keyboard navigation support

---

## 📝 Content Management

### Adding New Articles
Articles are stored in `/src/data/articles.json`. Each article should include:
- `id`: Unique identifier
- `chapterId`: Links to chapter in chapters.json
- `slug`: URL-friendly identifier
- `title` & `titleEn`: Bilingual titles
- `content`: Markdown-formatted content
- `author`, `date`, `readTime`: Metadata

### Adding Quiz Questions
Quizzes are stored in `/src/data/quizzes.json`. Each quiz includes:
- Questions with multiple choice answers
- Correct answer index
- Explanations in Vietnamese and English
- Linked to specific chapters

---

## 🔒 Security Considerations

1. **API Keys:** Never commit actual API keys to version control
2. **Environment Variables:** Use `.env` file for sensitive data
3. **Content Moderation:** AI assistant is configured to decline inappropriate questions
4. **Academic Integrity:** System prompts enforce strict adherence to course materials

---

## 🌐 Deployment

The website is ready for deployment to:
- Netlify
- Vercel
- GitHub Pages
- Traditional web hosting

Remember to:
1. Set environment variables in your hosting platform
2. Configure build command: `npm run build`
3. Set publish directory: `dist`

---

## 📞 Support

For technical issues or content questions:
- Review the course materials in `/src/data/`
- Check AI chat functionality with proper API key
- Ensure all dependencies are installed correctly

---

## ✅ Transformation Checklist

- [x] Course structure updated to 4 main chapters
- [x] All UI text translated and updated
- [x] Gemini API integration completed
- [x] System prompts rewritten for Party History
- [x] Metadata and SEO tags updated
- [x] Build process verified
- [x] Environment configuration documented
- [x] README and documentation created

---

**Last Updated:** 2024-10-24
**Version:** 1.0
**Course Code:** VNR202
**Institution:** Vietnamese University System
