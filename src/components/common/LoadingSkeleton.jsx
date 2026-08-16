import { Skeleton, Space } from 'antd';
import PropTypes from 'prop-types';

/**
 * Skeleton shaped like the real timesheet table rows, so loading
 * doesn't feel like a generic spinner — it hints at the incoming layout.
 */
export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 16px',
            border: '1px solid var(--ts-border-color, #f0f0f0)',
            borderRadius: 8,
          }}
        >
          <Skeleton.Input active size="small" style={{ width: 90 }} />
          <Skeleton.Input active size="small" style={{ flex: 1 }} />
          <Skeleton.Button active size="small" style={{ width: 90 }} />
          <Skeleton.Input active size="small" style={{ width: 60 }} />
          <Skeleton.Button active size="small" shape="round" style={{ width: 70 }} />
        </div>
      ))}
    </Space>
  );
}

LoadingSkeleton.propTypes = {
  rows: PropTypes.number,
};
