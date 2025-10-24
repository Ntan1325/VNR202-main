import { TeamMember } from "./types";

export const teamMembers: TeamMember[] = [
    {
        name: "Nguyễn Hoàng Nhựt Tân - Phát triển",
        role: {
            vi: "Thiết kế & Phát triển Web, AI Chatbot, Quản trị Server",
            en: "Web Design & Development, AI Chatbot, Server Administration",
        },
        contributions: {
            vi: [
                "Thiết kế giao diện người dùng",
                "Tích hợp AI Chatbot với Groq",
                "Lập trình chức năng quiz",
                "Quản lý dữ liệu Supabase",
                "Triển khai và bảo trì server",
            ],
            en: [
                "Design and build user interface",
                "Integrate AI Chatbot with Groq",
                "Program quiz functionality",
                "Manage Supabase database",
                "Deploy and maintain server",
            ],
        },
        avatar: "/image.png",
    },
    {
        name: "Lê Thanh Tùng",
        role: {
            vi: "Chiến lược Nội dung, Phát triển Tài nguyên",
            en: "Content Strategy, Visual Asset Development, Quiz Design",
        },
        contributions: {
            vi: [
                "Xây dựng chiến lược nội dung",
                "Sáng tạo tài nguyên hình ảnh",
                "Thiết kế câu hỏi quiz",
                "Đảm bảo chất lượng nội dung",
            ],
            en: [
                "Build content strategy",
                "Create visual assets",
                "Design quiz questions",
                "Ensure content quality",
            ],
        },
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    }
];
