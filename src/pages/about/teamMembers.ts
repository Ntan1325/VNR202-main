import { TeamMember } from "./types";

export const teamMembers: TeamMember[] = [
    {
        name: "Trần Huy Hanh - Leader",
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
        name: "Trần Minh Trí",
        role: {
            vi: "Chiến lược Nội dung, Phát triển Tài nguyên, Thiết kế Quiz",
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
    },
    {
        name: "Tạ Thị Hải Yén",
        role: {
            vi: "Sáng tạo Nội dung, Quản lý Hình ảnh, Phát triển Quiz",
            en: "Content Creation, Image Curation, Educational Quiz Development",
        },
        contributions: {
            vi: [
                "Biên tập nội dung giáo dục",
                "Lựa chọn và tối ưu hình ảnh",
                "Phát triển câu hỏi giáo dục",
                "Kiểm tra độ chính xác nội dung",
            ],
            en: [
                "Write and edit educational content",
                "Select and optimize images",
                "Develop educational questions",
                "Verify content accuracy",
            ],
        },
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    {
        name: "Gia Bảo",
        role: {
            vi: "Phát triển & Kiểm thử Quiz, Tài liệu Kỹ thuật",
            en: "Quiz Development & Testing, Technical Documentation",
        },
        contributions: {
            vi: [
                "Kiểm thử và đảm bảo chất lượng",
                "Viết tài liệu kỹ thuật",
                "Tối ưu trải nghiệm người dùng",
            ],
            en: [
                "Test and ensure quality",
                "Write technical documentation",
                "Optimize user experience",
            ],
        },
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
    },
    {
        name: "Nguyễn Đức Tuyên",
        role: {
            vi: "Thiết kế Bài thuyết trình, Triển khai Quiz, Kiểm thử UX",
            en: "Presentation Design, Quiz Implementation, User Experience Testing",
        },
        contributions: {
            vi: [
                "Thiết kế bài thuyết trình",
                "Đánh giá trải nghiệm người dùng",
                "Thu thập và phân tích phản hồi",
            ],
            en: [
                "Design project presentations",
                "Test user experience",
                "Collect and analyze feedback",
            ],
        },
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
];
