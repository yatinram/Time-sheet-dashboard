import PropTypes from 'prop-types';
import { TimesheetContextProvider } from './TimesheetContext';
import TimesheetHeader from './TimesheetHeader';
import TimesheetRow from './TimesheetRow';
import TimesheetFooter from './TimesheetFooter';

/**
 * Compound component root. Usage:
 *
 *   <Timesheet entries={entries}>
 *     <Timesheet.Header />
 *     <Timesheet.Row onEdit={...} onDelete={...} onToggleBillable={...} />
 *     <Timesheet.Footer />
 *   </Timesheet>
 *
 * Sub-components read shared state (search/filter/entries) from
 * TimesheetContext rather than via prop-drilling.
 */
function Timesheet({ entries, children }) {
  return <TimesheetContextProvider entries={entries}>{children}</TimesheetContextProvider>;
}

Timesheet.propTypes = {
  entries: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

Timesheet.Header = TimesheetHeader;
Timesheet.Row = TimesheetRow;
Timesheet.Footer = TimesheetFooter;

export default Timesheet;
