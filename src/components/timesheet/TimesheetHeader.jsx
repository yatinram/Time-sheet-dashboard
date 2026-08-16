import { Input, Select } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useTimesheetContext } from './TimesheetContext';
import { CATEGORIES } from '../../constants/categories';

export default function TimesheetHeader() {
  const { searchTerm, setSearchTerm, categoryFilter, setCategoryFilter } = useTimesheetContext();

  return (
    <div className="timesheet-filter-bar">
      <Input
        allowClear
        size="large"
        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="timesheet-search-input"
      />
      <Select
        allowClear
        size="large"
        placeholder="Filter by category"
        suffixIcon={<FilterOutlined style={{ color: '#9ca3af' }} />}
        value={categoryFilter}
        onChange={(value) => setCategoryFilter(value ?? null)}
        className="timesheet-category-select"
        options={CATEGORIES.map((c) => ({ label: c, value: c }))}
      />
    </div>
  );
}
