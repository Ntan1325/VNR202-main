# Hướng dẫn tích hợp nội dung giáo dục vào website VNR202

## 📋 Tổng quan

Tài liệu này hướng dẫn cách tích hợp 3 chương nội dung giáo dục đã được tạo sẵn vào website VNR202.

---

## 📁 Cấu trúc file đã tạo

```
src/data/
├── chapter1_content.md  (Chương 1: 1930-1945, ~14,000 từ)
├── chapter2_content.md  (Chương 2: 1945-1975, ~15,000 từ)
└── chapter3_content.md  (Chương 3: 1975-2018, ~16,000 từ)
```

---

## 🔧 Bước 1: Tạo Parser Markdown

Cài đặt thư viện parse markdown (đã có sẵn trong project):
```bash
# react-markdown và remark-gfm đã được cài
npm list react-markdown remark-gfm
```

---

## 🔧 Bước 2: Tạo Article Component

### Tạo file `src/pages/ArticleView.tsx`:

```typescript
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ArticleView() {
  const { chapterId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChapter() {
      try {
        const response = await fetch(`/src/data/chapter${chapterId}_content.md`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading chapter:', error);
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [chapterId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20">Đang tải...</div>;
  }

  return (
    <article className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="prose prose-lg prose-slate dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
```

---

## 🔧 Bước 3: Cập nhật Router

### Trong `src/App.tsx`, thêm route mới:

```typescript
import ArticleView from './pages/ArticleView';

// Trong phần <Routes>
<Route path="/chapter/:chapterId" element={<ArticleView />} />
```

---

## 🔧 Bước 4: Cập nhật ChaptersSection Component

### Trong `src/components/ChaptersSection.tsx`:

```typescript
import { Link } from 'react-router-dom';

// Trong phần render của mỗi chapter card:
<Link
  to={`/chapter/${chapter.id}`}
  className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
>
  Xem chi tiết
</Link>
```

---

## 🔧 Bước 5: Styling Markdown Content

### Thêm vào `src/index.css`:

```css
/* Markdown Content Styling */
.prose {
  @apply text-gray-900 dark:text-gray-100;
}

.prose h1 {
  @apply text-4xl font-bold mb-6 text-red-700 dark:text-red-500 border-b-4 border-red-200 pb-4;
}

.prose h2 {
  @apply text-3xl font-bold mt-12 mb-4 text-red-600 dark:text-red-400;
}

.prose h3 {
  @apply text-2xl font-semibold mt-8 mb-3 text-gray-800 dark:text-gray-200;
}

.prose h4 {
  @apply text-xl font-semibold mt-6 mb-2 text-gray-700 dark:text-gray-300;
}

.prose p {
  @apply mb-4 leading-relaxed text-justify;
}

.prose ul, .prose ol {
  @apply my-4 ml-6 space-y-2;
}

.prose li {
  @apply leading-relaxed;
}

.prose strong {
  @apply font-bold text-red-700 dark:text-red-400;
}

.prose em {
  @apply italic text-gray-700 dark:text-gray-300;
}

.prose blockquote {
  @apply border-l-4 border-red-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 py-2;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono;
}

.prose hr {
  @apply my-8 border-t-2 border-red-200 dark:border-red-800;
}

/* Quiz questions styling */
.prose h3:has(+ p > strong:first-child) {
  @apply bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500;
}
```

---

## 🔧 Bước 6: Tích hợp AI Chat với nội dung chương

### Cập nhật `src/pages/Chat.tsx`:

Thêm context loading cho từng chương:

```typescript
// Thêm state để chọn chương
const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
const [chapterContext, setChapterContext] = useState<string>('');

// Load chapter context
useEffect(() => {
  if (selectedChapter) {
    fetch(`/src/data/chapter${selectedChapter}_content.md`)
      .then(res => res.text())
      .then(text => setChapterContext(text))
      .catch(err => console.error(err));
  }
}, [selectedChapter]);

// Cập nhật system prompt với context
const enhancedSystemPrompt = useMemo(() => {
  let prompt = systemPrompt;
  if (chapterContext) {
    prompt += `\n\nNỘI DUNG CHƯƠNG HIỆN TẠI:\n${chapterContext.substring(0, 3000)}...`;
  }
  return prompt;
}, [systemPrompt, chapterContext]);

// Thêm chapter selector trong UI
<select
  value={selectedChapter || ''}
  onChange={(e) => setSelectedChapter(Number(e.target.value))}
  className="mb-4 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
>
  <option value="">Chọn chương để AI hỗ trợ</option>
  <option value="1">Chương 1 (1930-1945)</option>
  <option value="2">Chương 2 (1945-1975)</option>
  <option value="3">Chương 3 (1975-2018)</option>
</select>
```

---

## 🔧 Bước 7: Tạo Quiz Component

### Tạo `src/components/ChapterQuiz.tsx`:

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ChapterQuizProps {
  questions: Question[];
  chapterTitle: string;
}

export default function ChapterQuiz({ questions, chapterTitle }: ChapterQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (showExplanation) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Hoàn thành!</h2>
        <p className="text-xl text-center mb-6">
          Điểm số: {score}/{questions.length}
        </p>
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setIsFinished(false);
            setShowExplanation(false);
            setSelectedAnswer(null);
          }}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Làm lại
        </button>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
      <div className="mb-6">
        <h3 className="text-sm text-gray-500 mb-2">
          Câu {currentQuestion + 1}/{questions.length}
        </h3>
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showExplanation}
            className={`w-full p-4 text-left rounded-lg border-2 transition ${
              showExplanation
                ? index === question.correct
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : selectedAnswer === index
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <span className="font-semibold mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded"
        >
          <p className="font-semibold mb-2">Giải thích:</p>
          <p>{question.explanation}</p>
        </motion.div>
      )}

      {showExplanation && (
        <button
          onClick={nextQuestion}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {currentQuestion < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
        </button>
      )}
    </div>
  );
}
```

---

## 🔧 Bước 8: Extract quiz từ markdown

### Tạo utility `src/utils/extractQuiz.ts`:

```typescript
export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function extractQuizFromMarkdown(markdown: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Pattern để tìm câu hỏi
  const questionPattern = /### Câu \d+:\n\*\*(.+?)\*\*\n\n((?:A\. .+?\n)+)\n\*\*Đáp án:\*\* (.+?)\n\n\*\*Giải thích:\*\* (.+?)(?=\n---|### Câu|\n\n##|$)/gs;

  let match;
  while ((match = questionPattern.exec(markdown)) !== null) {
    const [, question, optionsBlock, answer, explanation] = match;

    const options = optionsBlock
      .trim()
      .split('\n')
      .map(opt => opt.replace(/^[A-D]\.\s*/, ''));

    const correct = answer.charCodeAt(0) - 65; // Convert A,B,C,D to 0,1,2,3

    questions.push({
      question: question.trim(),
      options,
      correct,
      explanation: explanation.trim()
    });
  }

  return questions;
}
```

---

## 🔧 Bước 9: Tích hợp Quiz vào Article View

### Cập nhật `src/pages/ArticleView.tsx`:

```typescript
import ChapterQuiz from '../components/ChapterQuiz';
import { extractQuizFromMarkdown } from '../utils/extractQuiz';

// Trong component
const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

useEffect(() => {
  // ... existing load logic
  const questions = extractQuizFromMarkdown(text);
  setQuizQuestions(questions);
}, [chapterId]);

// Trong return
<>
  <div className="prose">
    {/* Markdown content */}
  </div>

  {quizQuestions.length > 0 && (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Câu hỏi ôn tập</h2>
      <ChapterQuiz
        questions={quizQuestions}
        chapterTitle={`Chương ${chapterId}`}
      />
    </div>
  )}
</>
```

---

## 🔧 Bước 10: Tạo Table of Contents

### Tạo `src/components/TableOfContents.tsx`:

```typescript
import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = content.match(/^#{2,4}\s+(.+)$/gm) || [];
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 2;
      const title = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      return { id, title, level };
    });
    setToc(tocItems);
  }, [content]);

  return (
    <nav className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4">Mục lục</h3>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-1 transition ${
                activeId === item.id
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-600 hover:text-red-600'
              }`}
              style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## 🎨 Bước 11: Layout với Sidebar

### Cập nhật ArticleView.tsx với layout mới:

```typescript
<div className="container mx-auto px-4 py-20">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    {/* Table of Contents - Sidebar */}
    <div className="lg:col-span-1">
      <TableOfContents content={content} />
    </div>

    {/* Main Content */}
    <div className="lg:col-span-3">
      <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>

      {/* Quiz Section */}
      {quizQuestions.length > 0 && (
        <div className="mt-12">
          <ChapterQuiz questions={quizQuestions} chapterTitle={`Chương ${chapterId}`} />
        </div>
      )}
    </div>
  </div>
</div>
```

---

## 🔧 Bước 12: Progress Tracking

### Tạo `src/hooks/useReadingProgress.ts`:

```typescript
import { useEffect, useState } from 'react';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
}
```

### Sử dụng trong ArticleView:

```typescript
import { useReadingProgress } from '../hooks/useReadingProgress';

const progress = useReadingProgress();

// Hiển thị progress bar
<div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
  <div
    className="h-full bg-red-600 transition-all duration-150"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## ✅ Checklist tích hợp

- [x] Parse markdown content
- [x] Tạo Article View component
- [x] Style markdown content (prose)
- [x] Extract và hiển thị quiz
- [x] Tích hợp AI chat với chapter context
- [x] Tạo Table of Contents
- [x] Reading progress bar
- [ ] Search trong nội dung
- [ ] Bookmark và lưu tiến độ học
- [ ] Print-friendly layout
- [ ] Export to PDF

---

## 🚀 Deployment

Sau khi hoàn thành các bước trên:

```bash
# Build project
npm run build

# Deploy to your hosting
# (Netlify, Vercel, or custom server)
```

---

## 📞 Lưu ý quan trọng

1. **Markdown files phải được serve đúng cách:**
   - Nếu dùng Vite, markdown files trong `/src` sẽ không được serve trực tiếp
   - Giải pháp: Di chuyển markdown files vào `/public/content/` hoặc import trực tiếp

2. **Alternative: Import trực tiếp:**
```typescript
import chapter1 from '../data/chapter1_content.md?raw';
// Sử dụng chapter1 như string
```

3. **SEO optimization:**
   - Thêm meta tags cho từng chương
   - Tạo sitemap.xml
   - Structured data (JSON-LD)

4. **Performance:**
   - Lazy load images
   - Code splitting cho từng chapter
   - Cache markdown content

---

**Hoàn thành!** 🎉

Nội dung giáo dục của cả 3 chương đã sẵn sàng để tích hợp vào website VNR202.
