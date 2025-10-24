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
import { callGroqChat, type GroqChatUsage } from "../lib/aiClient";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

const MODEL_ID = "llama-3.1-8b-instant";

const bubbleCommon =
  "relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg border border-white/10 backdrop-blur-md";
const gradientText =
  "bg-gradient-to-r from-amber-100 via-yellow-200 to-pink-200 bg-clip-text text-transparent";

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
            ? "bg-gradient-to-r from-red-500/70 via-amber-500/70 to-purple-500/70 text-white"
            : "bg-white/6 text-white"
        }`}
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/60 via-amber-500/60 to-purple-500/60">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-white/70">
              <span>
                {new Date(message.createdAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 transition hover:border-white/20 hover:bg-white/10"
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
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
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
  const [usage, setUsage] = useState<GroqChatUsage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  const aiKey =
    (import.meta.env.GROQ_API_KEY as string | undefined) ??
    (import.meta.env.VITE_GROQ_API_KEY as string | undefined);

  const systemPrompt = useMemo(
    () =>
      i18n.language === "vi"
        ? `Bạn là Trợ lý học thuật cho học phần HCM202 (Tư tưởng Hồ Chí Minh).
      CƠ SỞ DUY NHẤT: các tài liệu/giáo trình đã nạp cho hệ thống (hiện có “Chương III: Tư tưởng Hồ Chí Minh về độc lập dân tộc và chủ nghĩa xã hội”).
      YÊU CẦU TRẢ LỜI:
      1) Chỉ sử dụng thông tin có trong giáo trình; không suy diễn ngoài tài liệu, không bình luận thời sự/chính trị đương thời.
      2) Trình bày ngắn gọn, chính xác theo bối cảnh lịch sử: nêu khái niệm → luận điểm chính → dẫn chứng/niên đại/ trích dẫn có trong giáo trình.
      3) Khi trích nguyên văn, đặt trong ngoặc kép và ghi nguồn theo chương/mục (ví dụ: “Không có gì quý hơn độc lập, tự do” – Chương III).
      4) Nếu câu hỏi nằm ngoài phạm vi môn học hoặc đòi quan điểm/đánh giá không có trong giáo trình, TỪ CHỐI LỊCH SỰ bằng ngôn ngữ hiện tại, ví dụ:
         “Xin lỗi, câu hỏi này vượt phạm vi giáo trình HCM202/Chương hiện có nên mình không thể trả lời. Bạn có thể hỏi lại theo nội dung của chương nhé?”
      5) Nếu thông tin không có/không rõ trong giáo trình, nói thẳng “không thấy trong giáo trình” thay vì suy đoán.
      6) Giữ thái độ trung lập, tôn trọng; khuyến khích tinh thần tự học; tránh ngôn từ kích động.`
        : `You are the academic TA for course HCM202 (Ho Chi Minh Thought).
      SOLE GROUNDING: only the course materials loaded into the system (currently “Chapter III: Ho Chi Minh’s thought on national independence and socialism”).
      ANSWERING RULES:
      1) Use information strictly from the course text; no speculation beyond it; no commentary on current politics/events.
      2) Be concise and historically accurate: define → key theses → evidence/dates/quotes present in the text.
      3) For verbatim quotes, use quotation marks and cite chapter/section (e.g., “Nothing is more precious than independence and freedom” – Chapter III).
      4) If a question falls outside the course scope or seeks opinions not in the text, POLITELY DECLINE in the current UI language, e.g.:
         “Sorry, that’s outside the scope of HCM202/the loaded chapter, so I can’t answer. Please reframe within the chapter’s content.”
      5) If the text doesn’t contain the requested info, say so explicitly instead of guessing.
      6) Maintain neutrality and respect; encourage learning; avoid inflammatory language.`,
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
      const response = await callGroqChat({
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
    <section className="relative min-h-screen pt-20  overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/40 via-purple-900/50 to-fuchsia-900/60" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_rgba(0,0,0,0.6)]" />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/4 bg-white/5 blur-3xl"
        animate={{ x: ["0%", "180%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/8 shadow-[0_18px_55px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-40" />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-amber-500 to-purple-500">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1
                      className={`text-2xl sm:text-3xl font-extrabold ${gradientText}`}
                    >
                      {t("chat.title")}
                    </h1>
                    <p className="text-sm sm:text-base text-white/80">
                      {t("chat.subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/15"
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
                      className="rounded-2xl border border-white/10 bg-white/8 px-5 py-6 text-center text-white/75"
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
                      className={`${bubbleCommon} w-fit bg-white/10 text-white/70`}
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

              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-stretch">
                    <TextareaAutosize
                      minRows={1}
                      maxRows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("chat.inputPlaceholder") ?? "Type here..."}
                      className="w-full resize-none rounded-l-2xl border border-white/10 border-r-0 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !input.trim()}
                      className="inline-flex shrink-0 self-stretch items-center gap-2 rounded-r-2xl bg-gradient-to-r from-red-500 via-amber-500 to-purple-500 px-5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
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
