import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import LeftControlPanel from '../LeftControlPanel';

const defaultState = {
  lookBackWindow: 5,
  scenarioRuns: 1,
  blastRadius: 1,
  threatSeverity: 1,
  zeroDayNoise: false,
  assetMode: 'Network',
  liveForensics: false,
  splitView: false,
  zoomScope: 'Org-Wide',
};

describe('LeftControlPanel', () => {
  it('handles rotary slider wheel events', () => {
    const onChange = vi.fn();
    const { getByText } = render(
      <LeftControlPanel state={defaultState} onChange={onChange} onPulse={() => {}} />
    );

    const label = getByText('Look-Back Window');
    const slider = label.nextElementSibling as HTMLElement;
    fireEvent.wheel(slider, { deltaY: -1 });

    expect(onChange).toHaveBeenCalledWith('lookBackWindow', 10);
  });

  it('toggles switch state', () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(
      <LeftControlPanel state={defaultState} onChange={onChange} onPulse={() => {}} />
    );
    const toggle = getByLabelText('Zero-Day Noise');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith('zeroDayNoise', true);
  });
});
