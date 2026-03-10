import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4f46e5" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[100, 50, '#1e1b4b', '#1e1b4b']} 
      position={[0, -10, 0]} 
      rotation={[0, 0, 0]}
    />
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ParticleField />
        <Grid />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[15, 5, -10]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial color="#4f46e5" wireframe transparent opacity={0.2} />
          </mesh>
        </Float>

        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[-15, -5, -5]}>
            <torusKnotGeometry args={[1.5, 0.5, 128, 16]} />
            <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.2} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
