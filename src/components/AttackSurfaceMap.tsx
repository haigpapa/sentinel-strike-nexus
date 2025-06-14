
import React, { useRef, useEffect, useState } from 'react';

interface AssetNode {
  id: string;
  type: 'server' | 'iot' | 'saas';
  riskScore: number;
  openPorts: number[];
  patchAgeDays: number;
  activeAlerts: string[];
  x: number;
  y: number;
}

interface AttackSurfaceMapProps {
  assetMode: string;
  zoomScope: string;
  splitView: boolean;
  onNodeClick: (node: AssetNode) => void;
}

const AttackSurfaceMap: React.FC<AttackSurfaceMapProps> = ({ 
  assetMode, 
  zoomScope, 
  splitView, 
  onNodeClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<AssetNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<AssetNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate demo data based on asset mode
  useEffect(() => {
    const generateNodes = () => {
      const nodeCount = zoomScope === 'Org-Wide' ? 150 : 50;
      const newNodes: AssetNode[] = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const types: ('server' | 'iot' | 'saas')[] = 
          assetMode === 'Network' ? ['server', 'iot'] :
          assetMode === 'Endpoint' ? ['server'] :
          ['saas', 'server'];
        
        newNodes.push({
          id: `node-${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          riskScore: Math.floor(Math.random() * 100),
          openPorts: Array.from({ length: Math.floor(Math.random() * 5) }, () => 
            Math.floor(Math.random() * 65535)
          ),
          patchAgeDays: Math.floor(Math.random() * 365),
          activeAlerts: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => 
            `Alert ${i + 1}`
          ),
          x: Math.random() * 800,
          y: Math.random() * 600,
        });
      }
      
      setNodes(newNodes);
    };

    generateNodes();
  }, [assetMode, zoomScope]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#111418';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hex grid background
      drawHexGrid(ctx, canvas.width, canvas.height);

      // Draw split view divider if enabled
      if (splitView) {
        ctx.strokeStyle = '#6c7680';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes
      nodes.forEach(node => {
        drawNode(ctx, node, splitView ? canvas.width / 2 : canvas.width);
      });
    };

    render();
  }, [nodes, splitView]);

  const drawHexGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const hexSize = 30;
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    
    ctx.strokeStyle = '#6c7680';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;

    for (let row = 0; row < height / hexHeight + 2; row++) {
      for (let col = 0; col < width / hexWidth + 2; col++) {
        const x = col * hexWidth * 0.75;
        const y = row * hexHeight + (col % 2) * hexHeight / 2;
        
        drawHexagon(ctx, x, y, hexSize);
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: AssetNode, maxWidth: number) => {
    const x = (node.x / 800) * maxWidth;
    const y = node.y;
    
    // Risk-based heat map color
    const getRiskColor = (score: number) => {
      if (score < 30) return '#23d18b';
      if (score < 70) return '#f0c244';
      return '#ff4f4f';
    };

    const color = getRiskColor(node.riskScore);
    const radius = 6 + (node.riskScore / 100) * 4;

    // Outer glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Type indicator
    ctx.fillStyle = '#111418';
    ctx.font = '8px Inter';
    ctx.textAlign = 'center';
    const typeSymbol = node.type === 'server' ? 'S' : node.type === 'iot' ? 'I' : 'C';
    ctx.fillText(typeSymbol, x, y + 2);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x: e.clientX, y: e.clientY });

    // Check for node hover
    const maxWidth = splitView ? canvas.width / 2 : canvas.width;
    const hoveredNode = nodes.find(node => {
      const nodeX = (node.x / 800) * maxWidth;
      const nodeY = node.y;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      return distance < 15;
    });

    setHoveredNode(hoveredNode || null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNode) {
      onNodeClick(hoveredNode);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#111418]">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      
      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute bg-[#1a1f25] border border-[#6c7680]/30 rounded-lg p-3 text-sm pointer-events-none z-10 shadow-lg"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="space-y-1">
            <div className="font-medium text-foreground">
              {hoveredNode.type.toUpperCase()} - {hoveredNode.id}
            </div>
            <div className="text-slate">
              Risk Score: <span className="text-primary">{hoveredNode.riskScore}</span>
            </div>
            <div className="text-slate">
              Open Ports: {hoveredNode.openPorts.length}
            </div>
            <div className="text-slate">
              Patch Age: {hoveredNode.patchAgeDays}d
            </div>
            <div className="text-slate">
              Active Alerts: {hoveredNode.activeAlerts.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackSurfaceMap;
