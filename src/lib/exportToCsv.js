/**
 * Utility helper to convert time entries array to standard CSV format
 * and trigger immediate browser file download.
 */
export function exportToCsv(entries, filename = `Timesheet_Export_${new Date().toISOString().split('T')[0]}.csv`) {
  if (!entries || entries.length === 0) {
    return false;
  }

  const headers = ['Date', 'Description', 'Category', 'Hours', 'Billable Status'];

  const rows = entries.map((entry) => [
    `"${entry.entry_date || ''}"`,
    `"${(entry.description || '').replace(/"/g, '""')}"`,
    `"${entry.category || ''}"`,
    entry.hours ? Number(entry.hours).toFixed(2) : '0.00',
    entry.is_billable ? 'Billable' : 'Non-Billable',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
