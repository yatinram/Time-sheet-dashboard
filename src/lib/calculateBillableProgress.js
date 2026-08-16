/**
 * Pure function computing billable hours progress.
 * Extracted from HoursTracker so it can be unit tested independently
 * of React (the component still wraps the call in useMemo).
 *
 * @param {Array<{hours: number, is_billable: boolean}>} entries
 * @param {number} weeklyTargetHours
 * @returns {{ billableHours: number, percent: number }}
 */
export function calculateBillableProgress(entries, weeklyTargetHours) {
  const billableHours = entries
    .filter((e) => e.is_billable)
    .reduce((sum, e) => sum + Number(e.hours), 0);

  const safeTarget = weeklyTargetHours > 0 ? weeklyTargetHours : 1; // avoid divide-by-zero
  const percent = (billableHours / safeTarget) * 100;

  return { billableHours, percent };
}
