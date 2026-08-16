import HoursTracker from '../tracker/HoursTracker';
import { useTimesheetContext } from './TimesheetContext';

export default function TimesheetFooter() {
  const { entries } = useTimesheetContext();
  // Footer intentionally uses the full (unfiltered) entries list —
  // the weekly progress reflects all logged hours, not just the search result.
  return <HoursTracker entries={entries} />;
}
