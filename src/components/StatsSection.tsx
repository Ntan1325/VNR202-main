// components/StatsSection.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import {
  BookOpen,
  Globe,
  CircleCheck as CheckCircle,
  Users,
} from "lucide-react";

const stats = [
  { icon: BookOpen, value: 16, labelVi: "Bài viết triết học", labelEn: "Philosophy Articles" ,suffix: "+"},
  { icon: Globe, value: 2, labelVi: "Ngôn ngữ hỗ trợ", labelEn: "Languages Supported" },
  { icon: CheckCircle, value: 80, labelVi: "Câu hỏi quiz", labelEn: "Quiz Questions", suffix: "+" },
  { icon: Users, value: 5, labelVi: "Chương học", labelEn: "Learning Chapters", suffix: "+" },
];

export default function StatsSection() {
  const { i18n } = useTranslation();
  const isVietnamese = i18n.language === "vi";

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Nền đồng bộ Hero: gradient đỏ→tím + vignette + light sweep nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/40 via-purple-900/50 to-fuchsia-900/60" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_200px_rgba(0,0,0,0.55)]" />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/4 bg-white/5 blur-3xl"
        animate={{ x: ["0%", "180%"] }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -4 }}
              className="group relative text-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 md:p-7
                         shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              {/* viền phát sáng rất nhẹ khi hover */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               ring-1 ring-transparent [background:radial-gradient(1200px_circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.12),transparent_40%)]" />
              {/* Icon nền gradient đồng bộ CTA */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                              bg-gradient-to-br from-red-600 to-yellow-500 text-white shadow-lg">
                <stat.icon className="h-8 w-8" />
              </div>

              <div className="text-3xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-1">
                <CountUp
                  end={stat.value}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                  suffix={stat.suffix || ""}
                />
              </div>

              <div className="text-white/80 font-medium">
                {isVietnamese ? stat.labelVi : stat.labelEn}
              </div>

              {/* gạch chân gradient nhấn sắc độ */}
              <div
                className="mx-auto mt-3 h-[2px] w-10 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(239,68,68,0.9) 0%, rgba(234,179,8,0.9) 50%, rgba(168,85,247,0.9) 100%)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
