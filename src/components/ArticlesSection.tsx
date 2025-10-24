// components/ArticlesSection.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import articlesData from "../data/articles.json";

export default function ArticlesSection() {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === "vi";
  const latestArticles = articlesData.slice(0, 3);

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Nền đồng bộ Hero/Header: gradient đỏ→tím + vignette + light sweep */}
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
        {/* Tiêu đề & mô tả */}
        <motion.div className="text-center mb-14">
          <motion.h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-amber-100 to-pink-100 bg-clip-text text-transparent mb-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]">
            {t("home.articles.title")}
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            {t("home.articles.subtitle")}
          </motion.p>
        </motion.div>

        {/* Lưới bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.06 + index * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md shadow-[0_15px_45px_rgba(0,0,0,0.28)]"
            >
              {/* Accent gradient khi hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              bg-gradient-to-tr from-red-500/15 via-yellow-500/10 to-purple-500/15" />

              {/* Ảnh bìa */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={isVietnamese ? article.title : article.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

                {/* Read time badge */}
                <motion.div
                  className="absolute top-4 right-4 bg-black/35 text-white/90 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 shadow-md"
                  whileHover={{ scale: 1 }}
                >
                  <span className="text-xs font-medium">
                    {isVietnamese ? article.readTime : article.readTimeEn}
                  </span>
                </motion.div>
              </div>

              {/* Nội dung */}
              <div className="relative p-6">
                <motion.h3
                  className="text-xl font-bold text-white mb-3 line-clamp-2 tracking-tight group-hover:text-amber-200 transition-colors duration-300"
                >
                  {isVietnamese ? article.title : article.titleEn}
                </motion.h3>

                <p className="text-white/85 mb-4 line-clamp-3 leading-relaxed">
                  {isVietnamese ? article.excerpt : article.excerptEn}
                </p>

                {/* CTA đọc thêm: gradient chữ đỏ→vàng→tím */}
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link
                    to={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-2 font-semibold"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(234,179,8,1) 50%, rgba(168,85,247,1) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    <span>{t("home.articles.readMore")}</span>
                    <ArrowRight className="h-4 w-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
