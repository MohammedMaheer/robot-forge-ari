import React, { useRef, useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { RobotTelemetry } from '@robotforge/types';
import { cn } from '../utils/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RobotViewerProps {
  urdfUrl: string;
  telemetry?: RobotTelemetry;
  width?: number;
  height?: number;
  className?: string;
  /** Show joint labels. */
  showLabels?: boolean;
  /** Show ghost trail of end-effector path. */
  showTrajectory?: boolean;
  /** Camera configuration override. */
  cameraPosition?: [number, number, number];
}

// ---------------------------------------------------------------------------
// Joint visualizer — updates at 50Hz from telemetry
// ---------------------------------------------------------------------------

interface JointVisualizerProps {
  telemetry?: RobotTelemetry;
  showLabels?: boolean;
}

function JointVisualizer({ telemetry, showLabels }: JointVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current || !telemetry) return;

    // Animate each child (link) to match joint positions
    const joints = telemetry.jointPositions;
    groupRef.current.children.forEach((child, idx) => {
      if (idx < joints.length && child instanceof THREE.Mesh) {
        child.rotation.z = joints[idx];
      }
    });
  });

  // Build a simple skeleton from joint count
  const jointCount = telemetry?.jointPositions.length ?? 6;
  const links = useMemo(() => {
    const segments: React.ReactElement[] = [];
    for (let i = 0; i < jointCount; i++) {
      const yPos = i * 0.15;
      segments.push(
        <mesh key={i} position={[0, yPos, 0]}>
          <cylinderGeometry args={[0.03, 0.025, 0.14, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#2563EB' : '#1E293B'} />
        </mesh>
      );
      // Joint sphere
      segments.push(
        <mesh key={`j${i}`} position={[0, yPos + 0.07, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#2ECC71" metalness={0.4} roughness={0.3} />
          {showLabels && (
            <Html position={[0.08, 0, 0]} center>
              <span className="text-[9px] text-green-400 whitespace-nowrap bg-black/60 px-1 rounded">
                J{i} {telemetry ? `${(telemetry.jointPositions[i] * (180 / Math.PI)).toFixed(1)}°` : ''}
              </span>
            </Html>
          )}
        </mesh>
      );
    }
    return segments;
  }, [jointCount]);

  return <group ref={groupRef}>{links}</group>;
}

// ---------------------------------------------------------------------------
// End-effector indicator with trajectory trail
// ---------------------------------------------------------------------------

const MAX_TRAIL_POINTS = 200;

function EndEffectorMarker({ telemetry, showTrajectory }: { telemetry?: RobotTelemetry; showTrajectory?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.BufferGeometry>(null);
  const trailPositions = useRef<number[]>([]);

  useFrame(() => {
    if (!meshRef.current || !telemetry) return;
    const { x, y, z } = telemetry.endEffectorPose;
    meshRef.current.position.set(x, y, z);

    // Update trajectory trail
    if (showTrajectory && trailRef.current) {
      trailPositions.current.push(x, y, z);
      if (trailPositions.current.length > MAX_TRAIL_POINTS * 3) {
        trailPositions.current = trailPositions.current.slice(-MAX_TRAIL_POINTS * 3);
      }
      const attr = trailRef.current.getAttribute('position') as THREE.BufferAttribute;
      if (attr) {
        const arr = new Float32Array(MAX_TRAIL_POINTS * 3);
        const src = trailPositions.current;
        for (let i = 0; i < src.length && i < arr.length; i++) {
          arr[arr.length - src.length + i] = src[i];
        }
        attr.set(arr);
        attr.needsUpdate = true;
        trailRef.current.setDrawRange(0, Math.floor(src.length / 3));
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.3} />
      </mesh>
      {showTrajectory && (
        <line>
          <bufferGeometry ref={trailRef}>
            <bufferAttribute
              attach="attributes-position"
              count={MAX_TRAIL_POINTS}
              array={new Float32Array(MAX_TRAIL_POINTS * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#EF4444" opacity={0.4} transparent />
        </line>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function RobotScene({ telemetry, showLabels, showTrajectory }: { telemetry?: RobotTelemetry; showLabels?: boolean; showTrajectory?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow shadow-mapSize={1024} />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />
      <Grid
        infiniteGrid
        cellSize={0.1}
        sectionSize={1}
        cellColor="#334155"
        sectionColor="#475569"
        fadeDistance={10}
      />
      <JointVisualizer telemetry={telemetry} showLabels={showLabels} />
      <EndEffectorMarker telemetry={telemetry} showTrajectory={showTrajectory} />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        minDistance={0.5}
        maxDistance={5}
        target={[0, 0.4, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function RobotViewer({ urdfUrl, telemetry, width, height, className, showLabels = false, showTrajectory = true, cameraPosition }: RobotViewerProps) {
  return (
    <div
      className={cn('rounded-lg overflow-hidden bg-surface border border-surface-border', className)}
      style={{ width: width ?? '100%', height: height ?? 400 }}
    >
      <Canvas
        camera={{ position: cameraPosition ?? [1.5, 1, 1.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0F172A');
        }}
      >
        <Suspense fallback={null}>
          <RobotScene telemetry={telemetry} showLabels={showLabels} showTrajectory={showTrajectory} />
        </Suspense>
      </Canvas>

      {/* Telemetry overlay */}
      {telemetry && (
        <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-[10px] text-text-secondary space-y-0.5 backdrop-blur-sm">
          <p>EE: ({telemetry.endEffectorPose.x.toFixed(3)}, {telemetry.endEffectorPose.y.toFixed(3)}, {telemetry.endEffectorPose.z.toFixed(3)})</p>
          <p>Joints: {telemetry.jointPositions.length} DoF</p>
          {telemetry.gripperState !== undefined && (
            <p>Gripper: {telemetry.gripperState.toFixed(0)}%</p>
          )}
        </div>
      )}
    </div>
  );
}
