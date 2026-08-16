import { useMemo } from 'react';
import { Card, Col, Progress, Row, Statistic } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { DEFAULT_WEEKLY_TARGET_HOURS } from '../../constants/categories';
import { calculateBillableProgress } from '../../lib/calculateBillableProgress';

/**
 * Status colors based on billable progress percentage:
 *   < 50%          -> primary blue (#2563eb)
 *   50% - 90%      -> warning orange (#f59e0b)
 *   90% - 100%     -> success green (#22c55e)
 *   > 100%         -> error red (#ef4444)
 */
function getProgressStatus(percent) {
  if (percent > 100) return 'exception';
  if (percent >= 90) return 'success';
  return 'normal';
}

function getStrokeColor(percent) {
  if (percent > 100) return '#ef4444';
  if (percent >= 90) return '#22c55e';
  if (percent >= 50) return '#f59e0b';
  return '#2563eb';
}

export default function HoursTracker({ entries, weeklyTargetHours = DEFAULT_WEEKLY_TARGET_HOURS }) {
  // Recalculates ONLY when entries or target changes — not on every render.
  const { billableHours, percent } = useMemo(
    () => calculateBillableProgress(entries, weeklyTargetHours),
    [entries, weeklyTargetHours]
  );

  const strokeColor = getStrokeColor(percent);

  return (
    <Card
      className="kpi-card hours-tracker-card"
      style={{
        marginTop: 24,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} sm={8}>
          <Statistic
            title={<span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Billable Progress</span>}
            value={percent.toFixed(1)}
            suffix="%"
            prefix={<ClockCircleOutlined style={{ color: strokeColor }} />}
            valueStyle={{ color: strokeColor, fontWeight: 800, fontSize: 32 }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title={<span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Logged Billable Hours</span>}
            value={billableHours.toFixed(1)}
            suffix={<span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{`/ ${weeklyTargetHours} hrs`}</span>}
            valueStyle={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 26 }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Progress
            percent={Math.min(percent, 100)}
            status={getProgressStatus(percent)}
            strokeColor={strokeColor}
            format={() => (
              <span style={{ color: strokeColor, fontWeight: 700 }}>
                {percent.toFixed(0)}%
              </span>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}

HoursTracker.propTypes = {
  entries: PropTypes.array.isRequired,
  weeklyTargetHours: PropTypes.number,
};
