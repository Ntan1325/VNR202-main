// pages/Home.tsx
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ChaptersSection from "../components/ChaptersSection";
import ArticlesSection from "../components/ArticlesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />
      <StatsSection />
      <ChaptersSection />
      <ArticlesSection />
    </div>
  );
}