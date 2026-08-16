import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../hooks/useDebounce';

const TimesheetContext = createContext(undefined);

/**
 * Shared state for the Timesheet compound component tree:
 * search text (debounced), category filter, and the filtered result set.
 * Timesheet.Header reads/writes filters; Timesheet.Row/Footer read the result.
 */
export function TimesheetContextProvider({ entries, children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.description
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesCategory = !categoryFilter || entry.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [entries, debouncedSearch, categoryFilter]);

  const value = {
    entries,
    filteredEntries,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
  };

  return <TimesheetContext.Provider value={value}>{children}</TimesheetContext.Provider>;
}

TimesheetContextProvider.propTypes = {
  entries: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

export function useTimesheetContext() {
  const context = useContext(TimesheetContext);
  if (context === undefined) {
    throw new Error('Timesheet compound components must be used within <Timesheet>');
  }
  return context;
}
