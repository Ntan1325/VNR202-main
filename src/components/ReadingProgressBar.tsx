import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 blur-sm opacity-50 origin-left z-[99]"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #dc2626 0%, #eab308 50%, #dc2626 100%)',
        }}
      />
    </>
  );
}