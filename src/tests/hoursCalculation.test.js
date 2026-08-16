import { describe, expect, it } from 'vitest';
import { calculateBillableProgress } from '../lib/calculateBillableProgress';

describe('calculateBillableProgress', () => {
  it('returns 0% when there are no entries', () => {
    const result = calculateBillableProgress([], 40);
    expect(result.billableHours).toBe(0);
    expect(result.percent).toBe(0);
  });

  it('only counts billable entries toward the total', () => {
    const entries = [
      { hours: 10, is_billable: true },
      { hours: 5, is_billable: false },
    ];
    const result = calculateBillableProgress(entries, 40);
    expect(result.billableHours).toBe(10);
    expect(result.percent).toBe(25); // 10 / 40 * 100
  });

  it('sums multiple billable entries correctly', () => {
    const entries = [
      { hours: 10, is_billable: true },
      { hours: 8, is_billable: true },
      { hours: 2, is_billable: true },
    ];
    const result = calculateBillableProgress(entries, 20);
    expect(result.billableHours).toBe(20);
    expect(result.percent).toBe(100);
  });

  it('can exceed 100% when logged hours exceed the weekly target', () => {
    const entries = [{ hours: 50, is_billable: true }];
    const result = calculateBillableProgress(entries, 40);
    expect(result.percent).toBe(125);
  });

  it('avoids divide-by-zero when weekly target is 0', () => {
    const entries = [{ hours: 5, is_billable: true }];
    const result = calculateBillableProgress(entries, 0);
    expect(Number.isFinite(result.percent)).toBe(true);
  });
});
