import React from 'react';
import { render, screen } from '@testing-library/react';
import RightDrawer from '../RightDrawer';

describe('RightDrawer', () => {
  const baseNode = {
    id: 'asset-1',
    type: 'server' as const,
    riskScore: 80,
    openPorts: [],
    patchAgeDays: 10,
    activeAlerts: ['Malware detected'],
  };

  it('applies high risk color class', () => {
    render(
      <RightDrawer isOpen={true} selectedNode={baseNode} onClose={() => {}} />
    );
    const score = screen.getByText(/80\/100/i);
    expect(score.className).toContain('text-[#ff4f4f]');
  });

  it('applies low risk color class', () => {
    const lowRiskNode = { ...baseNode, riskScore: 20 };
    render(
      <RightDrawer isOpen={true} selectedNode={lowRiskNode} onClose={() => {}} />
    );
    const score = screen.getByText(/20\/100/i);
    expect(score.className).toContain('text-[#23d18b]');
  });

  it('renders active alerts when present', () => {
    render(
      <RightDrawer isOpen={true} selectedNode={baseNode} onClose={() => {}} />
    );
    expect(screen.getByText('Malware detected')).toBeInTheDocument();
  });

  it('renders placeholder when no alerts', () => {
    const node = { ...baseNode, activeAlerts: [] };
    render(
      <RightDrawer isOpen={true} selectedNode={node} onClose={() => {}} />
    );
    expect(screen.getByText('No active alerts')).toBeInTheDocument();
  });
});
