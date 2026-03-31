import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
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
// URDF Parser — parses URDF XML into a joint/link tree
// ---------------------------------------------------------------------------

interface URDFJoint {
  name: string;
  type: 'revolute' | 'prismatic' | 'fixed' | 'continuous' | 'floating' | 'planar';
  parentLink: string;
  childLink: string;
  origin: { xyz: [number, number, number]; rpy: [number, number, number] };
  axis: [number, number, number];
}

interface URDFLink {
  name: string;
  visual?: {
    geometry: { type: 'box' | 'cylinder' | 'sphere' | 'mesh'; params: number[]; meshUrl?: string };
    origin: { xyz: [number, number, number]; rpy: [number, number, number] };
    color: [number, number, number, number];
  };
}

interface URDFModel {
  name: string;
  links: Map<string, URDFLink>;
  joints: URDFJoint[];
  rootLink: string;
}

function parseOrigin(el: Element | null): { xyz: [number, number, number]; rpy: [number, number, number] } {
  if (!el) return { xyz: [0, 0, 0], rpy: [0, 0, 0] };
  const xyz = (el.getAttribute('xyz') ?? '0 0 0').split(' ').map(Number) as [number, number, number];
  const rpy = (el.getAttribute('rpy') ?? '0 0 0').split(' ').map(Number) as [number, number, number];
  return { xyz, rpy };
}

function parseURDF(xml: string): URDFModel {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const robot = doc.querySelector('robot');
  const name = robot?.getAttribute('name') ?? 'robot';

  const links = new Map<string, URDFLink>();
  const childLinks = new Set<string>();

  doc.querySelectorAll('link').forEach((linkEl) => {
    const linkName = linkEl.getAttribute('name') ?? '';
    const visualEl = linkEl.querySelector('visual');
    let visual: URDFLink['visual'] = undefined;

    if (visualEl) {
      const geoEl = visualEl.querySelector('geometry');
      const originEl = visualEl.querySelector('origin');
      const materialEl = visualEl.querySelector('material');
      let geometry: URDFLink['visual'] extends undefined ? never : NonNullable<URDFLink['visual']>['geometry'] = { type: 'box', params: [0.05, 0.05, 0.05] };

      if (geoEl) {
        const box = geoEl.querySelector('box');
        const cyl = geoEl.querySelector('cylinder');
        const sphere = geoEl.querySelector('sphere');
        const mesh = geoEl.querySelector('mesh');

        if (box) {
          const size = (box.getAttribute('size') ?? '0.05 0.05 0.05').split(' ').map(Number);
          geometry = { type: 'box', params: size };
        } else if (cyl) {
          const r = Number(cyl.getAttribute('radius') ?? 0.025);
          const l = Number(cyl.getAttribute('length') ?? 0.1);
          geometry = { type: 'cylinder', params: [r, l] };
        } else if (sphere) {
          const r = Number(sphere.getAttribute('radius') ?? 0.03);
          geometry = { type: 'sphere', params: [r] };
        } else if (mesh) {
          geometry = { type: 'mesh', params: [], meshUrl: mesh.getAttribute('filename') ?? undefined };
        }
      }

      let color: [number, number, number, number] = [0.4, 0.4, 0.4, 1];
      if (materialEl) {
        const colorEl = materialEl.querySelector('color');
        if (colorEl) {
          const rgba = (colorEl.getAttribute('rgba') ?? '0.4 0.4 0.4 1').split(' ').map(Number);
          color = [rgba[0], rgba[1], rgba[2], rgba[3] ?? 1];
        }
      }

      visual = {
        geometry,
        origin: parseOrigin(originEl),
        color,
      };
    }

    links.set(linkName, { name: linkName, visual });
  });

  const joints: URDFJoint[] = [];
  doc.querySelectorAll('joint').forEach((jointEl) => {
    const jName = jointEl.getAttribute('name') ?? '';
    const jType = (jointEl.getAttribute('type') ?? 'fixed') as URDFJoint['type'];
    const parentEl = jointEl.querySelector('parent');
    const childEl = jointEl.querySelector('child');
    const originEl = jointEl.querySelector('origin');
    const axisEl = jointEl.querySelector('axis');

    const parentLink = parentEl?.getAttribute('link') ?? '';
    const childLink = childEl?.getAttribute('link') ?? '';
    childLinks.add(childLink);

    const axis = axisEl
      ? (axisEl.getAttribute('xyz') ?? '0 0 1').split(' ').map(Number) as [number, number, number]
      : [0, 0, 1] as [number, number, number];

    joints.push({
      name: jName,
      type: jType,
      parentLink,
      childLink,
      origin: parseOrigin(originEl),
      axis,
    });
  });

  // Root link = a link that is never a child
  let rootLink = '';
  for (const [linkName] of links) {
    if (!childLinks.has(linkName)) {
      rootLink = linkName;
      break;
    }
  }

  return { name, links, joints, rootLink };
}

// ---------------------------------------------------------------------------
// URDF Visualizer — renders parsed URDF model with telemetry
// ---------------------------------------------------------------------------

function URDFLinkMesh({ link }: { link: URDFLink }) {
  if (!link.visual) return null;
  const { geometry, origin, color } = link.visual;

  const euler = new THREE.Euler(origin.rpy[0], origin.rpy[1], origin.rpy[2], 'XYZ');

  let geo: React.ReactElement;
  switch (geometry.type) {
    case 'box':
      geo = <boxGeometry args={geometry.params as [number, number, number]} />;
      break;
    case 'cylinder':
      geo = <cylinderGeometry args={[geometry.params[0], geometry.params[0], geometry.params[1], 16]} />;
      break;
    case 'sphere':
      geo = <sphereGeometry args={[geometry.params[0], 16, 16]} />;
      break;
    default:
      geo = <boxGeometry args={[0.05, 0.05, 0.05]} />;
  }

  return (
    <mesh position={origin.xyz} rotation={euler}>
      {geo}
      <meshStandardMaterial color={new THREE.Color(color[0], color[1], color[2])} opacity={color[3]} transparent={color[3] < 1} />
    </mesh>
  );
}

function URDFVisualizer({ model, telemetry, showLabels }: { model: URDFModel; telemetry?: RobotTelemetry; showLabels?: boolean }) {
  const groupRefs = useRef<Map<string, THREE.Group>>(new Map());
  const movableJoints = useMemo(
    () => model.joints.filter((j) => j.type === 'revolute' || j.type === 'continuous' || j.type === 'prismatic'),
    [model]
  );

  useFrame(() => {
    if (!telemetry) return;
    movableJoints.forEach((joint, idx) => {
      const group = groupRefs.current.get(joint.name);
      if (!group || idx >= telemetry.jointPositions.length) return;

      const val = telemetry.jointPositions[idx];
      if (joint.type === 'prismatic') {
        group.position.set(
          joint.origin.xyz[0] + joint.axis[0] * val,
          joint.origin.xyz[1] + joint.axis[1] * val,
          joint.origin.xyz[2] + joint.axis[2] * val,
        );
      } else {
        // Revolute/continuous — rotate around axis
        const axisVec = new THREE.Vector3(...joint.axis).normalize();
        const baseEuler = new THREE.Euler(joint.origin.rpy[0], joint.origin.rpy[1], joint.origin.rpy[2], 'XYZ');
        const baseQuat = new THREE.Quaternion().setFromEuler(baseEuler);
        const jointQuat = new THREE.Quaternion().setFromAxisAngle(axisVec, val);
        group.quaternion.copy(baseQuat.multiply(jointQuat));
      }
    });
  });

  // Build tree recursively
  function renderLink(linkName: string): React.ReactElement | null {
    const link = model.links.get(linkName);
    if (!link) return null;

    // Find joints where this link is the parent
    const childJoints = model.joints.filter((j) => j.parentLink === linkName);

    return (
      <group key={linkName}>
        <URDFLinkMesh link={link} />
        {childJoints.map((joint) => {
          const isMovable = joint.type === 'revolute' || joint.type === 'continuous' || joint.type === 'prismatic';
          const jIdx = movableJoints.indexOf(joint);

          return (
            <group
              key={joint.name}
              ref={(ref: THREE.Group | null) => { if (ref) groupRefs.current.set(joint.name, ref); }}
              position={joint.origin.xyz}
              rotation={new THREE.Euler(joint.origin.rpy[0], joint.origin.rpy[1], joint.origin.rpy[2], 'XYZ')}
            >
              {/* Joint sphere indicator */}
              {isMovable && (
                <mesh>
                  <sphereGeometry args={[0.015, 12, 12]} />
                  <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.2} />
                  {showLabels && (
                    <Html position={[0.05, 0, 0]} center>
                      <span className="text-[9px] text-green-400 whitespace-nowrap bg-black/60 px-1 rounded">
                        {joint.name} {telemetry && jIdx >= 0 ? `${(telemetry.jointPositions[jIdx] * (180 / Math.PI)).toFixed(1)}°` : ''}
                      </span>
                    </Html>
                  )}
                </mesh>
              )}
              {renderLink(joint.childLink)}
            </group>
          );
        })}
      </group>
    );
  }

  return <>{renderLink(model.rootLink)}</>;
}

// ---------------------------------------------------------------------------
// Fallback joint visualizer (when no URDF)
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
  // Only include telemetry in deps when labels are visible — avoids 50Hz mesh recreation
  const telemetryForLabels = showLabels ? telemetry : null;
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
  }, [jointCount, showLabels, telemetryForLabels]);

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

function RobotScene({ urdfModel, telemetry, showLabels, showTrajectory }: { urdfModel?: URDFModel; telemetry?: RobotTelemetry; showLabels?: boolean; showTrajectory?: boolean }) {
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
      {urdfModel ? (
        <URDFVisualizer model={urdfModel} telemetry={telemetry} showLabels={showLabels} />
      ) : (
        <JointVisualizer telemetry={telemetry} showLabels={showLabels} />
      )}
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
  const [urdfModel, setUrdfModel] = useState<URDFModel | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!urdfUrl) return;
    let cancelled = false;

    async function loadURDF() {
      try {
        const res = await fetch(urdfUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        if (!cancelled) {
          const model = parseURDF(xml);
          setUrdfModel(model);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load URDF');
          setUrdfModel(undefined);
        }
      }
    }

    loadURDF();
    return () => { cancelled = true; };
  }, [urdfUrl]);

  return (
    <div
      className={cn('relative rounded-lg overflow-hidden bg-surface border border-surface-border', className)}
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
          <RobotScene urdfModel={urdfModel} telemetry={telemetry} showLabels={showLabels} showTrajectory={showTrajectory} />
        </Suspense>
      </Canvas>

      {/* Telemetry overlay */}
      {telemetry && (
        <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-[10px] text-text-secondary space-y-0.5 backdrop-blur-sm">
          <p>EE: ({telemetry.endEffectorPose.x.toFixed(3)}, {telemetry.endEffectorPose.y.toFixed(3)}, {telemetry.endEffectorPose.z.toFixed(3)})</p>
          <p>Joints: {telemetry.jointPositions.length} DoF</p>
          {telemetry.gripperPosition !== undefined && (
            <p>Gripper: {(telemetry.gripperPosition * 100).toFixed(0)}%</p>
          )}
        </div>
      )}

      {/* URDF status indicator */}
      <div className="absolute top-2 right-2 text-[10px] backdrop-blur-sm">
        {urdfModel ? (
          <span className="bg-accent-green/20 text-accent-green px-1.5 py-0.5 rounded">
            URDF: {urdfModel.name}
          </span>
        ) : loadError ? (
          <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded" title={loadError}>
            URDF Error
          </span>
        ) : urdfUrl ? (
          <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
            Loading URDF…
          </span>
        ) : (
          <span className="bg-gray-500/20 text-gray-400 px-1.5 py-0.5 rounded">
            Scaffold View
          </span>
        )}
      </div>
    </div>
  );
}
