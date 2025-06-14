
import React from 'react';
import { X, Shield, AlertTriangle, Server } from 'lucide-react';

interface AssetNode {
  id: string;
  type: 'server' | 'iot' | 'saas';
  riskScore: number;
  openPorts: number[];
  patchAgeDays: number;
  activeAlerts: string[];
}

interface RightDrawerProps {
  isOpen: boolean;
  selectedNode: AssetNode | null;
  onClose: () => void;
}

const RightDrawer: React.FC<RightDrawerProps> = ({ isOpen, selectedNode, onClose }) => {
  if (!isOpen || !selectedNode) return null;

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-[#23d18b]' };
    if (score < 70) return { level: 'Medium', color: 'text-[#f0c244]' };
    return { level: 'High', color: 'text-[#ff4f4f]' };
  };

  const risk = getRiskLevel(selectedNode.riskScore);

  return (
    <div className={`
      fixed right-0 top-12 bottom-0 w-96 bg-[#111418] border-l border-[#6c7680]/20 
      transform transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#6c7680]/20">
          <h3 className="text-lg font-bold text-foreground">Asset Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#6c7680]/20 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-slate" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Asset Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1a1f25] rounded-lg">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{selectedNode.id}</h4>
                <p className="text-sm text-slate capitalize">{selectedNode.type}</p>
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="space-y-2">
            <h5 className="font-medium text-foreground">Risk Assessment</h5>
            <div className="bg-[#1a1f25] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate">Risk Score</span>
                <span className={`font-bold ${risk.color}`}>
                  {selectedNode.riskScore}/100 ({risk.level})
                </span>
              </div>
              <div className="mt-2 w-full bg-[#6c7680]/20 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${selectedNode.riskScore}%`,
                    backgroundColor: selectedNode.riskScore < 30 ? '#23d18b' : 
                                   selectedNode.riskScore < 70 ? '#f0c244' : '#ff4f4f'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Open Ports */}
          <div className="space-y-2">
            <h5 className="font-medium text-foreground">Network Exposure</h5>
            <div className="bg-[#1a1f25] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate">Open Ports</span>
                <span className="text-foreground font-medium">{selectedNode.openPorts.length}</span>
              </div>
              {selectedNode.openPorts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedNode.openPorts.slice(0, 6).map((port, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#6c7680]/20 text-xs rounded text-slate"
                    >
                      {port}
                    </span>
                  ))}
                  {selectedNode.openPorts.length > 6 && (
                    <span className="px-2 py-1 bg-[#6c7680]/20 text-xs rounded text-slate">
                      +{selectedNode.openPorts.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Patch Status */}
          <div className="space-y-2">
            <h5 className="font-medium text-foreground">Patch Status</h5>
            <div className="bg-[#1a1f25] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate">Last Patched</span>
                <span className={`font-medium ${
                  selectedNode.patchAgeDays > 90 ? 'text-[#ff4f4f]' :
                  selectedNode.patchAgeDays > 30 ? 'text-[#f0c244]' : 'text-[#23d18b]'
                }`}>
                  {selectedNode.patchAgeDays} days ago
                </span>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="space-y-2">
            <h5 className="font-medium text-foreground">Active Alerts</h5>
            <div className="bg-[#1a1f25] rounded-lg p-4">
              {selectedNode.activeAlerts.length === 0 ? (
                <div className="flex items-center space-x-2 text-[#23d18b]">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">No active alerts</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedNode.activeAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-2 text-[#f0c244]">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{alert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#6c7680]/20">
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors">
            Mitigate Threats
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightDrawer;
