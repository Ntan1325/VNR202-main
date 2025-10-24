// pages/Home.tsx
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ChaptersSection from "../components/ChaptersSection";
import ArticlesSection from "../components/ArticlesSection";
import MouseFollower from "../components/MouseFollower";
import SmoothScroll from "../components/SmoothScroll";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <MouseFollower />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <HeroSection />
        <StatsSection />
        <ChaptersSection />
        <ArticlesSection />
      </motion.div>
    </>
  );
}