import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Decision, METRICS } from '../types';

interface RadarChart3DProps {
  decisionA: Decision;
  decisionB: Decision;
}

function RadarShape({ decision, color, opacity = 0.5 }: { decision: Decision; color: string; opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const angleStep = (Math.PI * 2) / METRICS.length;
    
    METRICS.forEach((metric, i) => {
      const angle = i * angleStep;
      const radius = (decision[metric.key] / 100) * 5;
      p.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ));
    });
    return p;
  }, [decision]);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i].x, points[i].y);
    }
    s.closePath();
    return s;
  }, [points]);

  return (
    <group>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      <Line
        points={[...points, points[0]]}
        color={color}
        lineWidth={2}
      />
    </group>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const angleStep = (Math.PI * 2) / METRICS.length;
    return METRICS.map((_, i) => {
      const angle = i * angleStep;
      return [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 5, Math.sin(angle) * 5, 0)
      ];
    });
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <Line key={i} points={points} color="#ffffff" opacity={0.1} transparent lineWidth={1} />
      ))}
      {[1, 2, 3, 4, 5].map((r) => (
        <Line
          key={r}
          points={METRICS.map((_, i) => {
            const angle = i * ((Math.PI * 2) / METRICS.length);
            return new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0);
          }).concat(new THREE.Vector3(Math.cos(0) * r, Math.sin(0) * r, 0))}
          color="#ffffff"
          opacity={0.05}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  );
}

export default function RadarChart3D({ decisionA, decisionB }: RadarChart3DProps) {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group rotation={[0, 0, Math.PI / 2]}>
            <GridLines />
            <RadarShape decision={decisionA} color="#06b6d4" opacity={0.3} />
            <RadarShape decision={decisionB} color="#a855f7" opacity={0.3} />
            
            {METRICS.map((metric, i) => {
              const angle = i * ((Math.PI * 2) / METRICS.length);
              const x = Math.cos(angle) * 6;
              const y = Math.sin(angle) * 6;
              return (
                <Text
                  key={metric.key}
                  position={[x, y, 0]}
                  fontSize={0.4}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  rotation={[0, 0, -Math.PI / 2]}
                >
                  {metric.label}
                </Text>
              );
            })}
          </group>
        </Float>
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-xs text-white/60">{decisionA.name || 'Decision A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-white/60">{decisionB.name || 'Decision B'}</span>
        </div>
      </div>
    </div>
  );
}
