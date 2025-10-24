import { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Enhanced3DCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function Enhanced3DCard({
  children,
  className = '',
  intensity = 20
}: Enhanced3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Floating glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3), rgba(234, 179, 8, 0.2), transparent)',
          filter: 'blur(30px)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card content */}
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>

      {/* Light reflection */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${useTransform(
            mouseXSpring,
            [-0.5, 0.5],
            ['0%', '100%']
          )} ${useTransform(
            mouseYSpring,
            [-0.5, 0.5],
            ['0%', '100%']
          )}, rgba(255, 255, 255, 0.3), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
}
