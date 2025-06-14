
import React from 'react';

interface TopBarProps {
  streamStatus: 'green' | 'amber' | 'red';
}

const TopBar: React.FC<TopBarProps> = ({ streamStatus }) => {
  const getStatusColor = () => {
    switch (streamStatus) {
      case 'green': return 'status-green';
      case 'amber': return 'status-amber';
      case 'red': return 'status-red';
      default: return 'status-green';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-[#111418] border-b border-[#6c7680]/20 flex items-center justify-between px-6 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SQ</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Sentinel-Q</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm text-slate font-medium">Data Stream</span>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} shadow-lg`}></div>
      </div>
    </div>
  );
};

export default TopBar;
