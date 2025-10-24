/**
 * Tiện ích chuyển đổi markdown thành văn bản thuần túy cho text-to-speech
 */

export function markdownToPlainText(markdown: string): string {
  if (!markdown) return '';

  let text = markdown;

  // Loại bỏ code blocks (```code```)
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // Loại bỏ inline code (`code`)
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Loại bỏ headers (# ## ###)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  // Loại bỏ bold (**text** hoặc __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  
  // Loại bỏ italic (*text* hoặc _text_)
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Loại bỏ strikethrough (~~text~~)
  text = text.replace(/~~([^~]+)~~/g, '$1');
  
  // Loại bỏ links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Loại bỏ images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Loại bỏ blockquotes (> text)
  text = text.replace(/^>\s+(.+)$/gm, '$1');
  
  // Loại bỏ horizontal rules (--- hoặc ***)
  text = text.replace(/^[-*]{3,}$/gm, '');
  
  // Loại bỏ list markers (- * + 1. 2.)
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1');
  text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1');
  
  // Loại bỏ HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Dọn dẹp khoảng trắng thừa
  text = text.replace(/\n\s*\n/g, '\n\n'); // Nhiều newlines thành double newline
  text = text.replace(/\n{3,}/g, '\n\n'); // Hơn 2 newlines thành 2
  text = text.trim();
  
  // Thay thế newlines bằng dấu chấm để TTS đọc tự nhiên hơn
  text = text.replace(/\n\n/g, '. ');
  text = text.replace(/\n/g, ' ');
  
  // Dọn dẹp nhiều khoảng trắng
  text = text.replace(/\s+/g, ' ');
  
  return text;
}