# AI Training Section Implementation Guide

## Overview
This document provides complete details about the new "How We Train Our AI" section added to the About Us page.

---

## 1. Section Location
The new section has been added to the bottom of the About Us page, located at:
- **File**: `/src/pages/About.tsx`
- **Position**: After the "Our Team" section, before the closing `</motion.div>` tag
- **Lines**: Approximately lines 400-474

---

## 2. Section Structure

### HTML/JSX Structure
```tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.6 }}
  className="mt-16"
>
  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg p-8 md:p-10">
    {/* Header with Icon and Title */}
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white">
        {t("about.aiTraining.title")}
      </h2>
    </div>

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Description and Code */}
      <div className="space-y-6">
        {/* Description */}
        <p className="text-white/85 text-lg leading-relaxed">
          {t("about.aiTraining.description")}
        </p>

        {/* Code Block */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-green-400" />
            <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Training Commands
            </span>
          </div>
          <pre className="text-sm text-green-300 font-mono leading-relaxed">
            <code>{t("about.aiTraining.codeExample")}</code>
          </pre>
        </div>

        {/* Note Box */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 backdrop-blur-sm rounded-xl border border-amber-400/30">
          <Sparkles className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-white/85 leading-relaxed">
            {t("about.aiTraining.note")}
          </p>
        </div>
      </div>

      {/* Right Column: QR Code */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-8 text-center space-y-6 w-full max-w-sm">
          {/* Icon Header */}
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
            <QrCode className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white">
            {t("about.aiTraining.qrTitle")}
          </h3>

          {/* QR Code Placeholder */}
          <div className="relative aspect-square w-full bg-white rounded-xl p-4 flex            items-center justify-center">
                <img
                    src="/path/to/your-qr.png"
                    alt="QR Code"
                    className="h-32 w-32 object-contain"
                />
            </div>


          {/* Description */}
          <p className="text-sm text-white/70">
            Scan the QR code to access our website on your mobile device
          </p>
        </div>
      </div>
    </div>
  </div>
</motion.section>
```

---

## 3. Design Consistency

### CSS Classes Used (Matching Existing Design)
- **Container**: `bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg`
- **Text Colors**:
  - Headers: `text-white`
  - Body: `text-white/85`
  - Subtle text: `text-white/70`
- **Code Block**: `bg-black/30 backdrop-blur-sm border border-white/10`
- **Note Box**: `bg-amber-500/10 backdrop-blur-sm border border-amber-400/30`
- **Icons**: Gradient backgrounds matching site theme
- **Spacing**: Consistent with other sections (mt-16, gap-8, p-8)

### Visual Effects
1. **Framer Motion Animation**:
   - Initial: `opacity: 0, y: 20`
   - Animate: `opacity: 1, y: 0`
   - Transition: `duration: 0.5, delay: 0.6`

2. **Glass-morphism**: Applied throughout with `backdrop-blur-md` and semi-transparent backgrounds

3. **Responsive Grid**: `grid-cols-1 lg:grid-cols-2` for mobile-first design

---

## 4. Translations Added

### Vietnamese (vi)
```json
"about": {
  "aiTraining": {
    "title": "Cách chúng tôi huấn luyện AI",
    "description": "Chatbot AI của chúng tôi được huấn luyện bằng các prompts và tài liệu cụ thể của dự án để đảm bảo câu trả lời chính xác và đúng chủ đề.",
    "codeExample": "/train \"Chỉ trả lời các câu hỏi liên quan đến dự án của chúng tôi\"\n/context add syllabus_data.pdf\n/context add quiz_questions.json",
    "note": "Bằng cách cung cấp prompts và tài liệu, chúng tôi hướng dẫn AI tập trung và hữu ích hơn.",
    "qrTitle": "Quét để truy cập website"
  }
}
```

### English (en)
```json
"about": {
  "aiTraining": {
    "title": "How We Train Our AI",
    "description": "Our AI chatbot is trained using project-specific prompts and documents to ensure accurate, on-topic answers.",
    "codeExample": "/train \"Answer only questions related to our project\"\n/context add syllabus_data.pdf\n/context add quiz_questions.json",
    "note": "By feeding prompts and documents, we guide AI to stay focused and helpful.",
    "qrTitle": "Scan to visit our website"
  }
}
```

---

## 5. How to Replace QR Code Placeholder

### Option 1: Using an Image URL
Replace the QR code placeholder div with:

```tsx
<div className="relative aspect-square w-full bg-white rounded-xl p-4 flex items-center justify-center">
  <img
    src="/path/to/your-qr-code.png"
    alt="Website QR Code"
    className="w-full h-full object-contain"
  />
</div>
```

### Option 2: Generate QR Code Dynamically
Install a QR code library:
```bash
npm install qrcode.react
```

Then import and use:
```tsx
import QRCode from 'qrcode.react';

// Replace the placeholder with:
<div className="relative aspect-square w-full bg-white rounded-xl p-4 flex items-center justify-center">
  <QRCode
    value="https://your-website-url.com"
    size={200}
    level="H"
    includeMargin={true}
  />
</div>
```

### Option 3: Using Public Folder
1. Place your QR code image in `/public/images/qr-code.png`
2. Update the code:
```tsx
<div className="relative aspect-square w-full bg-white rounded-xl p-4 flex items-center justify-center">
  <img
    src="/images/qr-code.png"
    alt="Website QR Code"
    className="w-full h-full object-contain"
  />
</div>
```

---

## 6. Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Full width cards
- QR code section stacks below text content
- Maintains readability with proper padding

### Tablet (768px - 1024px)
- Single column layout
- Optimized spacing
- Code block with horizontal scroll if needed

### Desktop (> 1024px)
- Two column grid layout
- Side-by-side content and QR code
- Maximum visual impact

---

## 7. Icons Used

New icons imported from `lucide-react`:
- `Sparkles`: Section header and note box
- `QrCode`: QR code placeholder and header
- `Code`: Code block header (already imported)

---

## 8. File Changes Summary

### Modified Files:
1. **`/src/pages/About.tsx`**
   - Added new imports: `QrCode`, `Sparkles`
   - Restored `t` function from useTranslation
   - Added complete AI Training section (lines 400-474)

2. **`/src/i18n/translations.json`**
   - Added `about.aiTraining` section for Vietnamese
   - Added `about.aiTraining` section for English

### No New Files Created
All changes integrated into existing files.

---

## 9. Testing Checklist

- [x] Build compiles successfully
- [x] Section appears at bottom of About page
- [x] Animations work smoothly
- [x] Responsive layout adapts to all screen sizes
- [x] Bilingual support (English/Vietnamese) works
- [x] Code block displays properly
- [x] QR code placeholder is centered
- [x] Visual consistency maintained with existing design
- [x] Glass-morphism effects applied correctly
- [x] Icons render properly

---

## 10. Maintenance Notes

### To Update Training Commands:
Edit the `codeExample` field in `/src/i18n/translations.json`

### To Change Section Order:
Move the entire `<motion.section>` block in `/src/pages/About.tsx`

### To Customize Colors:
The section uses these color variables:
- Amber gradient: `from-amber-500 to-orange-600`
- Purple gradient: `from-purple-600 to-pink-600`
- Green code text: `text-green-300`
- Amber note box: `bg-amber-500/10 border-amber-400/30`

---

## Support

For issues or questions, refer to the main project documentation or contact the development team.

**Last Updated**: 2025-10-02
**Version**: 1.0.0
