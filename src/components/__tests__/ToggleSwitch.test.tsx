import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleSwitch from '../ToggleSwitch';

describe('ToggleSwitch', () => {
  it('triggers onChange with toggled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleSwitch id="t" label="Test" checked={false} onChange={onChange} />
    );

    const button = screen.getByRole('button');
    await user.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles off when initially on', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToggleSwitch id="t" label="Test" checked={true} onChange={onChange} />
    );

    const button = screen.getByRole('button');
    await user.click(button);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
