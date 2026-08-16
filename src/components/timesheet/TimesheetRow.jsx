import { memo } from 'react';
import PropTypes from 'prop-types';
import { useTimesheetContext } from './TimesheetContext';
import TimesheetTable from './TimesheetTable';

function TimesheetRow({ onEdit, onDelete, onToggleBillable, onAddFirst }) {
  const { filteredEntries } = useTimesheetContext();

  return (
    <TimesheetTable
      entries={filteredEntries}
      showActions={true}
      pagination={true}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleBillable={onToggleBillable}
      onAddFirst={onAddFirst}
    />
  );
}

TimesheetRow.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleBillable: PropTypes.func.isRequired,
  onAddFirst: PropTypes.node,
};

export default memo(TimesheetRow);
