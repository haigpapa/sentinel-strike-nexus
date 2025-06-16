
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MapControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Define the shape for our asset data
interface AssetNode {
  id: string;
  type: 'server' | 'iot' | 'saas';
  riskScore: number;
  openPorts: number[];
  patchAgeDays: number;
  activeAlerts: string[];
  position: [number, number, number];
}

// The individual Hexagon node component
function HexNode({ node, onNodeClick, setHoveredNode }: { 
  node: AssetNode, 
  onNodeClick: (node: AssetNode) => void, 
  setHoveredNode: (node: AssetNode | null) => void 
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const color = useMemo(() => {
    if (node.riskScore < 30) return '#23d18b';
    if (node.riskScore < 70) return '#f0c244';
    return '#ff4f4f';
  }, [node.riskScore]);

  // Animate the node slightly on hover
  useFrame((state, delta) => {
    if (meshRef.current) {
      const scale = isHovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 10);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        setHoveredNode(node);
      }}
      onPointerOut={() => {
        setIsHovered(false);
        setHoveredNode(null);
      }}
    >
      <cylinderGeometry args={[1, 1, 0.4, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHovered ? 0.5 : 0.1} />
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.5}
        color="#111418"
        anchorX="center"
        anchorY="middle"
      >
        {node.type === 'server' ? 'S' : node.type === 'iot' ? 'I' : 'C'}
      </Text>
    </mesh>
  );
}

// The background hex grid using high-performance instancing
function HexGrid({ width, height }: { width: number, height: number }) {
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const hexGeom = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.1, 6), []);
  const hexMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#6c7680', 
    transparent: true, 
    opacity: 0.1 
  }), []);

  useEffect(() => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      let i = 0;
      for (let x = -width / 2; x < width / 2; x += 1.75) {
        for (let y = -height / 2; y < height / 2; y += 1.5) {
          const xPos = x + ((y % 3) * 0.875);
          dummy.position.set(xPos, y, -0.5);
          dummy.updateMatrix();
          instancedMeshRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [width, height]);

  return <instancedMesh ref={instancedMeshRef} args={[hexGeom, hexMat, (width * height)]} />;
}

// The main map component
const AttackSurfaceMap: React.FC<{
  assetMode: string;
  zoomScope: string;
  splitView: boolean;
  onNodeClick: (node: AssetNode) => void;
}> = ({ assetMode, zoomScope, splitView, onNodeClick }) => {
  const [nodes, setNodes] = useState<AssetNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<AssetNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate demo data
  useEffect(() => {
    const nodeCount = zoomScope === 'Org-Wide' ? 150 : 50;
    const newNodes: AssetNode[] = [];
    const area = nodeCount * 2;

    for (let i = 0; i < nodeCount; i++) {
      const types: ('server' | 'iot' | 'saas')[] =
        assetMode === 'Network' ? ['server', 'iot'] :
        assetMode === 'Endpoint' ? ['server'] :
        ['saas', 'server'];

      newNodes.push({
        id: `node-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        riskScore: Math.floor(Math.random() * 100),
        openPorts: Array.from({ length: Math.floor(Math.random() * 5) }, () => Math.floor(Math.random() * 65535)),
        patchAgeDays: Math.floor(Math.random() * 365),
        activeAlerts: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => `Alert ${i + 1}`),
        position: [(Math.random() - 0.5) * area, (Math.random() - 0.5) * (area * 0.5), 0],
      });
    }
    setNodes(newNodes);
  }, [assetMode, zoomScope]);
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const mapWidth = 80;
  const mapHeight = 60;

  return (
    <div className="relative w-full h-full bg-[#111418]" onPointerMove={handlePointerMove}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 50 }}
        className="cursor-crosshair"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MapControls enableRotate={false} />
        
        <HexGrid width={mapWidth} height={mapHeight} />

        {/* Simple split view representation */}
        {splitView && (
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[0.1, 100]} />
            <meshBasicMaterial color="#6c7680" toneMapped={false} />
          </mesh>
        )}
        
        {nodes.map(node => (
          <HexNode 
            key={node.id} 
            node={node} 
            onNodeClick={onNodeClick} 
            setHoveredNode={setHoveredNode}
          />
        ))}
      </Canvas>
      
      {/* Tooltip remains an HTML element overlaid on the canvas */}
      {hoveredNode && (
        <div
          className="absolute bg-[#1a1f25] border border-neutral-slate/30 rounded-lg p-3 text-sm text-white pointer-events-none z-10 shadow-lg"
          style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -100%) translateY(-10px)` }}
        >
          <div className="space-y-1">
            <div className="font-bold">{hoveredNode.id}</div>
            <div className="text-neutral-slate">Risk: {hoveredNode.riskScore}</div>
            <div className="text-neutral-slate">Type: {hoveredNode.type}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackSurfaceMap;
