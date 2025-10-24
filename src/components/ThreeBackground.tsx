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

    camera.position.z = 30;

    const geometries = [
      new THREE.TorusGeometry(10, 3, 16, 100),
      new THREE.OctahedronGeometry(8, 0),
      new THREE.IcosahedronGeometry(7, 0),
      new THREE.TetrahedronGeometry(9, 0),
    ];

    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
      }),
      new THREE.MeshPhongMaterial({
        color: 0xffdd00,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        emissive: 0xffdd00,
        emissiveIntensity: 0.15
      }),
      new THREE.MeshPhongMaterial({
        color: 0x0088ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
        emissive: 0x0088ff,
        emissiveIntensity: 0.1
      }),
    ];

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (Math.random() - 0.5) * 50;
      mesh.position.y = (Math.random() - 0.5) * 50;
      mesh.position.z = (Math.random() - 0.5) * 30;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.5 + 0.5;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
      meshes.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff0000, 2, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffdd00, 2, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

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

      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.002 + index * 0.0002;
        mesh.rotation.y += 0.003 + index * 0.0003;
        mesh.rotation.z += 0.001;

        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        mesh.position.x += Math.cos(Date.now() * 0.0008 + index) * 0.01;
      });

      camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 30;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 30;

      pointLight2.position.x = Math.cos(Date.now() * 0.0015) * 30;
      pointLight2.position.y = Math.sin(Date.now() * 0.0015) * 30;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);

      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (containerRef.current) {
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
