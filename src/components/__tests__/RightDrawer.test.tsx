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

  it('renders active alerts when present', () => {
    render(
      <RightDrawer isOpen={true} selectedNode={baseNode} onClose={() => {}} />
    );
    expect(screen.getByText('Malware detected')).toBeInTheDocument();
  });
});
