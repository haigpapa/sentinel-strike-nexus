
import React from 'react';
import RotarySlider from './RotarySlider';
import Stepper from './Stepper';
import ToggleSwitch from './ToggleSwitch';
import RadioGroup from './RadioGroup';
import Selector2Way from './Selector2Way';

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

interface LeftControlPanelProps {
  state: ControlState;
  onChange: (key: keyof ControlState, value: any) => void;
  onPulse: () => void;
}

const LeftControlPanel: React.FC<LeftControlPanelProps> = ({ state, onChange, onPulse }) => {
  return (
    <div className="w-80 bg-[#111418] border-r border-[#6c7680]/20 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-[#6c7680]/20">
        <h2 className="text-lg font-bold text-foreground">Control Panel</h2>
      </div>
      
      <div className="flex-1 space-y-1">
        <RotarySlider
          id="lookBackWindow"
          label="Look-Back Window"
          value={state.lookBackWindow}
          min={5}
          max={4320}
          step={5}
          unit="min"
          onChange={(value) => onChange('lookBackWindow', value)}
          onPulse={onPulse}
        />
        
        <div className="border-t border-[#6c7680]/10">
          <Stepper
            id="scenarioRuns"
            label="Scenario Iterations"
            value={state.scenarioRuns}
            min={1}
            max={20}
            step={1}
            onChange={(value) => onChange('scenarioRuns', value)}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <RotarySlider
            id="blastRadius"
            label="Blast Radius Multiplier"
            value={state.blastRadius}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value) => onChange('blastRadius', value)}
            onPulse={onPulse}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <RotarySlider
            id="threatSeverity"
            label="Threat Injection Severity"
            value={state.threatSeverity}
            min={1}
            max={10}
            step={0.5}
            unit="CVSS"
            onChange={(value) => onChange('threatSeverity', value)}
            onPulse={onPulse}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <ToggleSwitch
            id="zeroDayNoise"
            label="Zero-Day Noise"
            checked={state.zeroDayNoise}
            onChange={(value) => onChange('zeroDayNoise', value)}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <RadioGroup
            id="assetMode"
            label="Asset Mode"
            options={['Network', 'Endpoint', 'Cloud']}
            value={state.assetMode}
            onChange={(value) => onChange('assetMode', value)}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <ToggleSwitch
            id="liveForensics"
            label="Live / Forensics"
            checked={state.liveForensics}
            onChange={(value) => onChange('liveForensics', value)}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <ToggleSwitch
            id="splitView"
            label="Live vs Hardened"
            checked={state.splitView}
            onChange={(value) => onChange('splitView', value)}
          />
        </div>
        
        <div className="border-t border-[#6c7680]/10">
          <Selector2Way
            id="zoomScope"
            label="Zoom Scope"
            options={['Org-Wide', 'Team-Scope']}
            value={state.zoomScope}
            onChange={(value) => onChange('zoomScope', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftControlPanel;
