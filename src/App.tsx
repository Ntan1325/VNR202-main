import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Chapters from "./pages/Chapters";
import Article from "./pages/Article";
import Quiz from "./pages/Quiz";
import Feedback from "./pages/Feedback";
import Chat from "./pages/Chat";
import About from "./pages/About";
import "./components/globals.css";
import "./i18n/i18n";

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chat");

  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.title =
      i18n.language === "vi" ? "Tư tưởng Hồ Chí Minh" : "Ho Chi Minh Ideology";
  }, [i18n.language]);

  return (
    <div
      className={[
        "flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white",
        isChatRoute ? "overflow-hidden" : "",
      ].join(" ")}
    >
      <ScrollToTop />
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          className={["flex-1", isChatRoute ? "overflow-hidden" : ""].join(" ")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/chapters/:slug" element={<Chapters />} />
            <Route path="/articles/:slug" element={<Article />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isChatRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
