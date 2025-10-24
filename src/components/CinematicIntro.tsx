import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'darkness' | 'burst' | 'reveal' | 'title' | 'complete'>('darkness');
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    setShowSkip(true);

    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 50;

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 60 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 30;

      const isGold = Math.random() > 0.6;
      colors[i3] = isGold ? 0.831 : 0.545;
      colors[i3 + 1] = isGold ? 0.686 : 0;
      colors[i3 + 2] = isGold ? 0.216 : 0;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const starShape = new THREE.Shape();
    const outerRadius = 4;
    const innerRadius = 2;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        starShape.moveTo(x, y);
      } else {
        starShape.lineTo(x, y);
      }
    }
    starShape.closePath();

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.2,
      bevelSegments: 3
    };

    const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      emissive: 0xD4AF37,
      emissiveIntensity: 0,
      metalness: 0.9,
      roughness: 0.1
    });

    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.scale.set(0, 0, 0);
    star.rotation.x = Math.PI;
    scene.add(star);

    const hammerGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
    const sickleGeometry = new THREE.TorusGeometry(2, 0.3, 8, 32, Math.PI);

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B0000,
      emissive: 0x8B0000,
      emissiveIntensity: 0,
      metalness: 0.9,
      roughness: 0.1
    });

    const hammer = new THREE.Mesh(hammerGeometry, metalMaterial);
    const sickle = new THREE.Mesh(sickleGeometry, metalMaterial);

    hammer.position.set(-2, 1, 0);
    hammer.rotation.z = Math.PI / 4;
    sickle.position.set(1, -1, 0);
    sickle.rotation.z = -Math.PI / 4;

    const emblemGroup = new THREE.Group();
    emblemGroup.add(star);
    emblemGroup.add(hammer);
    emblemGroup.add(sickle);
    emblemGroup.scale.set(0, 0, 0);
    emblemGroup.position.z = -10;
    scene.add(emblemGroup);

    const pointLight1 = new THREE.PointLight(0x8B0000, 0, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xD4AF37, 0, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
    directionalLight.position.set(0, 0, 50);
    scene.add(directionalLight);

    const lightRays: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const rayGeometry = new THREE.PlaneGeometry(0.3, 100);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.z = -10;
      ray.rotation.z = (i * Math.PI) / 6;
      scene.add(ray);
      lightRays.push(ray);
    }

    const shockwaveGeometry = new THREE.RingGeometry(0.1, 1, 32);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xD4AF37,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
    shockwave.position.z = -10;
    scene.add(shockwave);

    let startTime = Date.now();
    let explosionTriggered = false;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsed = (Date.now() - startTime) / 1000;

      if (elapsed < 2) {
        setPhase('darkness');
        particlesMaterial.opacity = Math.min(elapsed / 2, 0.6);
        camera.position.z = 50 - elapsed * 5;
        particles.rotation.y += 0.001;
      }
      else if (elapsed < 3.5 && !explosionTriggered) {
        explosionTriggered = true;
        setPhase('burst');

        pointLight1.intensity = 20;
        pointLight2.intensity = 20;
        directionalLight.intensity = 2;

        starMaterial.emissiveIntensity = 3;
        metalMaterial.emissiveIntensity = 3;

        const positions = particlesGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const currentX = positions[i3];
          const currentY = positions[i3 + 1];
          const currentZ = positions[i3 + 2];

          const length = Math.sqrt(currentX * currentX + currentY * currentY + currentZ * currentZ);
          const force = 80;

          positions[i3] = currentX + (currentX / length) * force;
          positions[i3 + 1] = currentY + (currentY / length) * force;
          positions[i3 + 2] = currentZ + (currentZ / length) * force;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
      }
      else if (elapsed >= 3.5 && elapsed < 6) {
        setPhase('reveal');
        const revealProgress = (elapsed - 3.5) / 2.5;

        emblemGroup.scale.setScalar(Math.min(revealProgress * 1.5, 1.2));
        emblemGroup.rotation.y = revealProgress * Math.PI * 2;

        lightRays.forEach((ray, index) => {
          (ray.material as THREE.MeshBasicMaterial).opacity = Math.sin(revealProgress * Math.PI) * 0.6;
          ray.rotation.z += 0.01;
        });

        shockwave.scale.setScalar(1 + revealProgress * 30);
        (shockwave.material as THREE.MeshBasicMaterial).opacity = (1 - revealProgress) * 0.8;

        pointLight1.intensity = 20 * (1 - revealProgress * 0.5);
        pointLight2.intensity = 20 * (1 - revealProgress * 0.5);

        camera.position.z = 45 - revealProgress * 20;
      }
      else if (elapsed >= 6) {
        setPhase('title');

        if (elapsed >= 9) {
          setPhase('complete');
        }
      }

      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      if (emblemGroup.scale.x > 0) {
        emblemGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black"
      >
        <div ref={containerRef} className="absolute inset-0" />

        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="wait">
            {phase === 'title' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, rotateX: -90 }}
                  animate={{ scale: 1, rotateX: 0 }}
                  transition={{ duration: 1, type: "spring", stiffness: 100 }}
                  className="mb-8"
                >
                  <h1 className="text-8xl font-black bg-gradient-to-r from-revolutionary-600 via-gold-500 to-revolutionary-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                      style={{
                        textShadow: '0 0 40px rgba(139,0,0,0.8), 0 0 80px rgba(212,175,55,0.6)',
                        WebkitTextStroke: '2px rgba(212,175,55,0.3)'
                      }}>
                    VNR202
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-revolutionary-600/20 to-gold-500/20 blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  <h2 className="relative text-4xl md:text-6xl font-bold text-parchment-50 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    Lịch Sử Đảng Cộng Sản Việt Nam
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="mt-6 text-xl text-gold-200/80 font-medium"
                >
                  Khơi dậy niềm tự hào – Tiếp nối truyền thống cách mạng
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="mt-12 pointer-events-auto"
                >
                  <motion.button
                    onClick={onComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-gradient-to-r from-revolutionary-600 to-gold-500 rounded-full text-parchment-50 text-lg font-bold shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300"
                  >
                    Bắt đầu khám phá
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showSkip && phase !== 'complete' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={onComplete}
            className="absolute top-8 right-8 z-50 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-300"
          >
            Bỏ qua intro →
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
