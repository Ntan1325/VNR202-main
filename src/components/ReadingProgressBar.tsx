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
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-revolutionary-600 via-gold-500 to-revolutionary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 blur-sm opacity-50 origin-left z-[99]"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #8B0000 0%, #D4AF37 50%, #8B0000 100%)',
        }}
      />
    </>
  );
}