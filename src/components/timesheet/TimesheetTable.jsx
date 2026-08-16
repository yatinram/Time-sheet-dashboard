import { memo } from 'react';
import { Modal, Space, Switch, Table, Tag, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  StopOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import EmptyState from '../common/EmptyState';

const { Text } = Typography;

function getCategoryClass(category) {
  if (category === 'Development') return 'category-pill-dev';
  if (category === 'Design') return 'category-pill-design';
  return 'category-pill-meeting';
}

/**
 * Reusable Timesheet Table Component shared across both Dashboard feed and Timesheet Log page.
 * Delete action now opens an Ant Design Modal.confirm dialog.
 */
function TimesheetTable({
  entries = [],
  showActions = true,
  pagination = false,
  onEdit,
  onDelete,
  onToggleBillable,
  onAddFirst,
}) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<InboxOutlined style={{ fontSize: 48, color: '#6b7280' }} />}
        title="No time entries found"
        description="Try adjusting your search or filters, or log your first entry."
        action={onAddFirst}
      />
    );
  }

  const handleDeleteClick = (record) => {
    Modal.confirm({
      title: 'Delete Time Entry',
      icon: <ExclamationCircleFilled style={{ color: '#ef4444' }} />,
      content: (
        <div style={{ marginTop: 8 }}>
          <Text style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete this entry?
          </Text>
          <div
            style={{
              marginTop: 12,
              padding: '12px 16px',
              borderRadius: 10,
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Text strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: 14 }}>
              {record.description}
            </Text>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4, display: 'block' }}>
              {record.entry_date} · {Number(record.hours).toFixed(1)} hrs · {record.category}
            </Text>
          </div>
          <Text type="danger" style={{ fontSize: 12, marginTop: 10, display: 'block' }}>
            This action cannot be undone.
          </Text>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      maskClosable: true,
      styles: {
        body: { paddingBottom: 8 },
      },
      onOk() {
        onDelete(record.id);
      },
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'entry_date',
      key: 'entry_date',
      sorter: (a, b) => new Date(a.entry_date) - new Date(b.entry_date),
      width: 120,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (category) => (
        <span className={`category-pill ${getCategoryClass(category)}`}>
          {category}
        </span>
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 110,
      align: 'right',
      sorter: (a, b) => a.hours - b.hours,
      render: (hours) => <Text style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{Number(hours).toFixed(1)} hrs</Text>,
    },
    {
      title: 'Billable',
      dataIndex: 'is_billable',
      key: 'is_billable',
      width: 160,
      render: (isBillable, record) => (
        <Space>
          <Tag
            icon={isBillable ? <DollarCircleOutlined /> : <StopOutlined />}
            color={isBillable ? 'success' : 'default'}
            style={{ borderRadius: 6, fontWeight: 500 }}
          >
            {isBillable ? 'Billable' : 'Non-Billable'}
          </Tag>
          {onToggleBillable && (
            <Switch
              size="small"
              checked={isBillable}
              onChange={(checked) => onToggleBillable(record.id, checked)}
            />
          )}
        </Space>
      ),
    },
  ];

  if (showActions) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Space size="middle">
          {onEdit && (
            <Tooltip title="Edit entry">
              <EditOutlined
                style={{ cursor: 'pointer', color: '#2563eb', fontSize: 16 }}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete entry">
              <DeleteOutlined
                style={{ cursor: 'pointer', color: '#ef4444', fontSize: 16 }}
                onClick={() => handleDeleteClick(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    });
  }

  const paginationConfig = pagination
    ? typeof pagination === 'object'
      ? pagination
      : {
          defaultPageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ['5', '8', '10', '20', '50'],
          showTotal: (total, range) => (
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{range[0]}-{range[1]}</strong> of <strong style={{ color: '#2563eb' }}>{total}</strong> entries
            </span>
          ),
        }
    : false;

  return (
    <Table
      rowKey="id"
      dataSource={entries}
      columns={columns}
      rowClassName={() => 'table-row-hover'}
      pagination={paginationConfig}
      scroll={{ x: 700 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  );
}

TimesheetTable.propTypes = {
  entries: PropTypes.array,
  showActions: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleBillable: PropTypes.func,
  onAddFirst: PropTypes.node,
};

export default memo(TimesheetTable);
