
import React, { useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import LeftControlPanel from '../components/LeftControlPanel';
import AttackSurfaceMap from '../components/AttackSurfaceMap';
import RightDrawer from '../components/RightDrawer';

interface ControlState {
  lookBackWindow: number;
  scenarioRuns: number;
  blastRadius: number;
  threatSeverity: number;
  zeroDayNoise: boolean;
  assetMode: string;
  liveForensics: boolean;
  splitView: boolean;
  zoomScope: string;
}

interface AssetNode {
  id: string;
  type: 'server' | 'iot' | 'saas';
  riskScore: number;
  openPorts: number[];
  patchAgeDays: number;
  activeAlerts: string[];
  position: [number, number, number]; // Updated to match 3D position
}

const Index = () => {
  const [streamStatus, setStreamStatus] = useState<'green' | 'amber' | 'red'>('green');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AssetNode | null>(null);

  const [controlState, setControlState] = useState<ControlState>({
    lookBackWindow: 60,
    scenarioRuns: 5,
    blastRadius: 1.0,
    threatSeverity: 5.0,
    zeroDayNoise: false,
    assetMode: 'Network',
    liveForensics: true,
    splitView: false,
    zoomScope: 'Org-Wide',
  });

  const handleControlChange = useCallback(
    <K extends keyof ControlState>(key: K, value: ControlState[K]) => {
      setControlState(prev => ({ ...prev, [key]: value }));
    
    // Simulate stream status changes based on controls
    if (key === 'threatSeverity' && value > 8) {
      setStreamStatus('red');
    } else if (key === 'zeroDayNoise' && value) {
      setStreamStatus('amber');
    } else {
      setStreamStatus('green');
    }
    },
    []
  );

  const handlePulse = useCallback(() => {
    console.log('Control pulse animation triggered');
  }, []);

  const handleNodeClick = useCallback((node: AssetNode) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedNode(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#111418] text-foreground font-inter">
      <TopBar streamStatus={streamStatus} />
      
      <div className="flex h-screen pt-12">
        <LeftControlPanel
          state={controlState}
          onChange={handleControlChange}
          onPulse={handlePulse}
        />
        
        <div className="flex-1 relative">
          <AttackSurfaceMap
            assetMode={controlState.assetMode}
            zoomScope={controlState.zoomScope}
            splitView={controlState.splitView}
            onNodeClick={handleNodeClick}
          />
        </div>
        
        <RightDrawer
          isOpen={isDrawerOpen}
          selectedNode={selectedNode}
          onClose={handleDrawerClose}
        />
      </div>
    </div>
  );
};

export default Index;
