import { useState } from 'react';
import { Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import Timesheet from '../components/timesheet/Timesheet';
import LogEntryForm from '../components/forms/LogEntryForm';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';
import AppButton from '../components/common/AppButton';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { useToast } from '../context/ToastContext';
import { exportToCsv } from '../lib/exportToCsv';

export default function TimesheetPage() {
  const { showSuccess, showError, showInfo } = useToast();
  const { entries, loading, error, refetch, addEntry, updateEntry, deleteEntry, toggleBillable } =
    useTimeEntries();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openAddForm = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, payload);
        showSuccess('Entry updated successfully');
      } else {
        await addEntry(payload);
        showSuccess('Entry added successfully');
      }
      setFormOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to save entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      showInfo('Entry deleted');
    } catch (err) {
      showError(err.message || 'Failed to delete entry.');
    }
  };

  const handleToggleBillable = async (id, isBillable) => {
    try {
      await toggleBillable(id, isBillable);
      showSuccess(`Status updated to ${isBillable ? 'Billable' : 'Non-Billable'}`);
    } catch (err) {
      showError(err.message || 'Failed to update billable status.');
    }
  };

  const handleExportCsv = () => {
    if (!entries || entries.length === 0) {
      showInfo('No entries available to export.');
      return;
    }
    const success = exportToCsv(entries);
    if (success) {
      showSuccess('Timesheet report exported to CSV!');
    } else {
      showError('Failed to export CSV.');
    }
  };

  return (
    <DashboardLayout>
      {/* Reusable Common Page Header Component with Action Buttons Props */}
      <PageHeader
        title="Timesheet Log"
       
        actions={
          <Space size="middle">
            <AppButton
              variant="default"
              icon={<DownloadOutlined />}
              onClick={handleExportCsv}
              style={{ height: 42, padding: '0 18px', fontWeight: 600, borderRadius: 10 }}
            >
              Export CSV
            </AppButton>
            <AppButton
              variant="primary"
              icon={<PlusOutlined />}
              className="btn-gradient-primary add-entry-btn"
              onClick={openAddForm}
            >
              Add Entry
            </AppButton>
          </Space>
        }
      />

      {/* Main Timesheet View */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={refetch} />
      ) : (
        <Timesheet entries={entries}>
          <Timesheet.Header />
          <Timesheet.Row
            onEdit={openEditForm}
            onDelete={handleDelete}
            onToggleBillable={handleToggleBillable}
            onAddFirst={
              <AppButton
                variant="primary"
                icon={<PlusOutlined />}
                className="btn-gradient-primary"
                onClick={openAddForm}
              >
                Add Entry
              </AppButton>
            }
          />
          <Timesheet.Footer />
        </Timesheet>
      )}

      {/* Add / Edit Entry Modal */}
      <LogEntryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingEntry}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}
