import { describe, it, expect, vi } from 'vitest';
import { generateNodes, getRiskColor } from '../AttackSurfaceMap';

// mock Math.random for deterministic tests

describe('generateNodes', () => {
  it('creates correct number of nodes based on zoom scope', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const nodes = generateNodes('Network', 'Org-Wide');
    expect(nodes).toHaveLength(150);
    nodes.forEach(n => {
      expect(['server', 'iot']).toContain(n.type);
    });
  });

  it('supports team scope', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const nodes = generateNodes('Endpoint', 'Team-Scope');
    expect(nodes).toHaveLength(50);
    nodes.forEach(n => {
      expect(n.type).toBe('server');
    });
  });
});

describe('getRiskColor', () => {
  it('returns green for low scores', () => {
    expect(getRiskColor(10)).toBe('#23d18b');
  });

  it('returns yellow for medium scores', () => {
    expect(getRiskColor(50)).toBe('#f0c244');
  });

  it('returns red for high scores', () => {
    expect(getRiskColor(90)).toBe('#ff4f4f');
  });
});
