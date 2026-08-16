import { Typography } from 'antd';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

/**
 * Reusable Page Header component across all dashboard views.
 * Accepts props:
 *   - title: Page main title (e.g. "Dashboard Overview", "Timesheet Log")
 *   - subtitle: Optional secondary description text
 *   - actions: Optional button(s) or action nodes passed via props
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header-row">
      <div>
        <Title level={2} className="page-title-text">
          {title}
        </Title>
        {subtitle && (
          <Text style={{ color: '#9ca3af', fontSize: 14 }}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
};
