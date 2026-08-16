import { Card, Progress, Statistic, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

/**
 * Reusable Summary / KPI Card Component for the Dashboard.
 * Uses dynamic theme CSS variables for crisp visibility in both Light and Dark mode.
 */
export default function SummaryCard({
  title,
  value,
  suffix,
  prefix,
  subtitle,
  subtitleColor = 'var(--text-secondary)',
  valueStyle,
  progress,
  progressColor,
}) {
  const mergedValueStyle = {
    color: 'var(--text-primary)',
    fontWeight: 800,
    fontSize: 28,
    ...valueStyle,
  };

  return (
    <Card className="kpi-card">
      {progress !== undefined ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="kpi-title">{title}</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: mergedValueStyle.color, marginTop: 4 }}>
              {value}
              {suffix && <span style={{ fontSize: 16, marginLeft: 4, fontWeight: 600 }}>{suffix}</span>}
            </div>
          </div>
          <Progress
            type="circle"
            percent={Math.min(progress, 100)}
            width={56}
            strokeColor={progressColor || '#2563eb'}
            format={() => ''}
          />
        </div>
      ) : (
        <Statistic
          title={<span className="kpi-title">{title}</span>}
          value={value}
          suffix={suffix}
          prefix={prefix}
          valueStyle={mergedValueStyle}
        />
      )}
      {subtitle && (
        <Text style={{ color: subtitleColor, fontSize: 12, marginTop: progress !== undefined ? 12 : 8, display: 'block' }}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.node,
  prefix: PropTypes.node,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  valueStyle: PropTypes.object,
  progress: PropTypes.number,
  progressColor: PropTypes.string,
};
