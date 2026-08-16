import { Empty, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

/**
 * Generic animated empty-state block with dark subtle border and floating icon animation.
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state-animated">
      <div className="empty-icon-float">
        {icon || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
      <div>
        <Text strong style={{ fontSize: 16, display: 'block', color: '#e5e7eb', marginBottom: 6 }}>
          {title}
        </Text>
        {description && (
          <Text style={{ color: '#9ca3af', fontSize: 14, display: 'block', marginBottom: 16 }}>
            {description}
          </Text>
        )}
      </div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};
