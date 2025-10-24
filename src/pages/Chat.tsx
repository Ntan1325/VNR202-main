import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Check,
  Copy,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { callGeminiChat, type GeminiUsage } from "../lib/aiClient";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

const MODEL_ID = "gemini-1.5-flash";

const bubbleCommon =
  "relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg border border-white/10 backdrop-blur-md";
const gradientText =
  "text-revolutionary-600 dark:text-gold-400";

const MessageBubbleInner = ({
  message,
  isLatest,
  onCopy,
  isCopied,
  copyLabel,
  copiedLabel,
}: {
  message: ChatMessage;
  isLatest: boolean;
  onCopy: () => void;
  isCopied: boolean;
  copyLabel: string;
  copiedLabel: string;
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`${bubbleCommon} ${
          isUser
            ? "bg-revolutionary-600 text-parchment-50"
            : "bg-parchment-50/95 dark:bg-brown-800/95 text-deeptext-900 dark:text-parchment-100"
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500">
              <Bot className="h-5 w-5 text-deeptext-900" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs opacity-70">
              <span>
                {new Date(message.createdAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1 rounded-full border border-current/20 bg-current/10 px-2.5 py-1 transition hover:border-current/30 hover:bg-current/20"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>{copiedLabel}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copyLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {isLatest && (
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold-500/30" />
        )}
      </div>
    </motion.div>
  );
};

const MessageBubble = memo(MessageBubbleInner);

export default function Chat() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<GeminiUsage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  const aiKey =
    (import.meta.env.GEMINI_API_KEY as string | undefined) ??
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  const systemPrompt = useMemo(
    () =>
      i18n.language === "vi"
        ? `Bạn là trợ lý học tập chuyên về môn Lịch sử Đảng Cộng sản Việt Nam (VNR202). Hãy giải thích, tóm tắt và hỗ trợ người học ôn tập từng chương một cách dễ hiểu, có ví dụ và câu hỏi luyện tập.

CƠ SỞ DUY NHẤT: các tài liệu/giáo trình đã nạp cho hệ thống về Lịch sử Đảng Cộng sản Việt Nam.

YÊU CẦU TRẢ LỜI:
1) Chỉ sử dụng thông tin có trong giáo trình; không suy diễn ngoài tài liệu, không bình luận thời sự/chính trị đương thời.
2) Trình bày ngắn gọn, chính xác theo bối cảnh lịch sử: nêu khái niệm → luận điểm chính → dẫn chứng/niên đại/sự kiện có trong giáo trình.
3) Khi trích nguyên văn, đặt trong ngoặc kép và ghi nguồn theo chương/mục.
4) Nếu câu hỏi nằm ngoài phạm vi môn học hoặc đòi quan điểm/đánh giá không có trong giáo trình, TỪ CHỐI LỊCH SỰ bằng ngôn ngữ hiện tại, ví dụ: "Xin lỗi, câu hỏi này vượt phạm vi giáo trình VNR202 nên mình không thể trả lời. Bạn có thể hỏi lại theo nội dung của chương nhé?"
5) Nếu thông tin không có/không rõ trong giáo trình, nói thẳng "không thấy trong giáo trình" thay vì suy đoán.
6) Giữ thái độ trung lập, tôn trọng; khuyến khích tinh thần tự học; tránh ngôn từ kích động.
7) Luôn cung cấp câu trả lời dễ hiểu với ví dụ cụ thể và câu hỏi ôn tập để học sinh tự kiểm tra.`
        : `You are an academic assistant specializing in the History of the Communist Party of Vietnam (VNR202). Explain, summarize and help students review each chapter in an easy-to-understand manner, with examples and practice questions.

SOLE GROUNDING: only the course materials loaded into the system about the History of the Communist Party of Vietnam.

ANSWERING RULES:
1) Use information strictly from the course text; no speculation beyond it; no commentary on current politics/events.
2) Be concise and historically accurate: define → key theses → evidence/dates/events present in the text.
3) For verbatim quotes, use quotation marks and cite chapter/section.
4) If a question falls outside the course scope or seeks opinions not in the text, POLITELY DECLINE in the current UI language, e.g.: "Sorry, that's outside the scope of VNR202, so I can't answer. Please reframe within the chapter's content."
5) If the text doesn't contain the requested info, say so explicitly instead of guessing.
6) Maintain neutrality and respect; encourage learning; avoid inflammatory language.
7) Always provide easy-to-understand answers with specific examples and review questions for self-testing.`,
    [i18n.language]
  );

  useEffect(() => {
    if (!chatListRef.current) return;
    if (messages.length === 0 && !isLoading) return;

    chatListRef.current.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleCopy = useCallback((message: ChatMessage) => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
    setUsage(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    const chatPayload = nextMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const response = await callGeminiChat({
        apiKey: aiKey,
        model: MODEL_ID,
        messages: [{ role: "system", content: systemPrompt }, ...chatPayload],
      });

      if (!response) {
        setError(t("chat.error"));
        return;
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.content,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setUsage(response.usage ?? null);
    } catch (err) {
      console.error(err);
      setError(t("chat.error"));
    } finally {
      setIsLoading(false);
    }
  }, [aiKey, input, isLoading, messages, systemPrompt, t]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-parchment-100 dark:bg-brown-900">
      <div className="absolute inset-0 bg-gradient-to-br from-revolutionary-600/5 via-gold-500/5 to-parchment-200/5 dark:from-revolutionary-900/20 dark:via-brown-800/20 dark:to-brown-900/20" />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/4 bg-gold-500/10 blur-3xl"
        animate={{ x: ["0%", "180%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-parchment-600/30 dark:border-brown-700/50 bg-parchment-50/90 dark:bg-brown-800/90 backdrop-blur-sm shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-40" />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-revolutionary-600">
                    <MessageCircle className="h-6 w-6 text-parchment-50" />
                  </div>
                  <div>
                    <h1
                      className={`text-2xl sm:text-3xl font-extrabold ${gradientText}`}
                    >
                      {t("chat.title")}
                    </h1>
                    <p className="text-sm sm:text-base text-deeptext-800 dark:text-parchment-200">
                      {t("chat.subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-full border border-parchment-600/30 dark:border-brown-600/50 bg-parchment-100/50 dark:bg-brown-700/50 px-4 py-2 text-sm font-medium text-deeptext-900 dark:text-parchment-100 transition hover:bg-parchment-200/50 dark:hover:bg-brown-600/50"
              >
                <Trash2 className="h-4 w-4" />
                {t("chat.clear")}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              <div
                ref={chatListRef}
                className="chat-scroll relative max-h-[60vh] overflow-y-auto pr-2"
              >
                <div className="space-y-4">
                  {messages.length === 0 && !isLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-parchment-600/30 dark:border-brown-700/50 bg-parchment-100/50 dark:bg-brown-800/50 px-5 py-6 text-center text-deeptext-700 dark:text-parchment-200"
                    >
                      {t("chat.emptyState")}
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isLatest={index === messages.length - 1}
                        onCopy={() => handleCopy(message)}
                        isCopied={copiedId === message.id}
                        copyLabel={t("chat.buttons.copy")}
                        copiedLabel={t("chat.buttons.copied")}
                      />
                    ))
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                      className={`${bubbleCommon} w-fit bg-gold-100/50 dark:bg-gold-900/30 text-deeptext-700 dark:text-gold-200`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>{t("chat.aiThinking")}</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={scrollAnchorRef} />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-parchment-600/30 dark:border-brown-700/50 bg-parchment-100/70 dark:bg-brown-800/70 p-4 backdrop-blur">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-stretch">
                    <TextareaAutosize
                      minRows={1}
                      maxRows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("chat.inputPlaceholder") ?? "Type here..."}
                      className="w-full resize-none rounded-l-2xl border border-parchment-600/30 dark:border-brown-600/50 border-r-0 bg-parchment-50 dark:bg-brown-900 px-4 py-3 text-sm text-deeptext-900 dark:text-parchment-100 placeholder:text-deeptext-500 dark:placeholder:text-parchment-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                    />

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !input.trim()}
                      className="inline-flex shrink-0 self-stretch items-center gap-2 rounded-r-2xl bg-revolutionary-600 px-5 text-sm font-semibold text-parchment-50 shadow-lg transition hover:bg-revolutionary-700 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                    >
                      <Send className="h-4 w-4" />
                      {t("chat.send")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
