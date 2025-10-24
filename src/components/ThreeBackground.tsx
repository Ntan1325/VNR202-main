import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 40;

    const createVietnameseFlag = (width: number, height: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#DA251D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const starRadius = canvas.width * 0.25;

      ctx.fillStyle = '#FFCD00';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * starRadius;
        const y = centerY + Math.sin(angle) * starRadius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        shininess: 30
      });

      return new THREE.Mesh(geometry, material);
    };

    const flags: THREE.Mesh[] = [];
    const flagCount = 5;

    for (let i = 0; i < flagCount; i++) {
      const flag = createVietnameseFlag(12, 8);

      flag.position.x = (Math.random() - 0.5) * 60;
      flag.position.y = (Math.random() - 0.5) * 40;
      flag.position.z = (Math.random() - 0.5) * 40 - 10;

      flag.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.4 + 0.6;
      flag.scale.set(scale, scale, scale);

      scene.add(flag);
      flags.push(flag);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xD4AF37, 0.4);
    directionalLight2.position.set(-10, -10, 10);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xDA251D, 1, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      flags.forEach((flag, index) => {
        const geometry = flag.geometry as THREE.PlaneGeometry;
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);

          const waveX = Math.sin(x * 0.5 + time + index) * 0.3;
          const waveY = Math.sin(y * 0.3 + time * 1.2 + index) * 0.2;
          const wave = waveX + waveY;

          positions.setZ(i, wave);
        }

        positions.needsUpdate = true;

        flag.rotation.y += 0.001 + index * 0.0002;

        flag.position.y += Math.sin(time * 0.5 + index) * 0.008;
        flag.position.x += Math.cos(time * 0.3 + index) * 0.005;
      });

      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      pointLight.position.x = Math.sin(time * 0.5) * 20;
      pointLight.position.y = Math.cos(time * 0.5) * 20;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);

      flags.forEach(flag => {
        flag.geometry.dispose();
        if (flag.material instanceof THREE.Material) {
          if (flag.material.map) {
            flag.material.map.dispose();
          }
          flag.material.dispose();
        }
      });

      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
