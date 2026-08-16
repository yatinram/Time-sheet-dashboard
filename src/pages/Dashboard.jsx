import { useMemo } from 'react';
import { Card, Col, Row } from 'antd';
import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  ThunderboltOutlined,
  RightOutlined,
  InboxOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import TimesheetTable from '../components/timesheet/TimesheetTable';
import AppButton from '../components/common/AppButton';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { DEFAULT_WEEKLY_TARGET_HOURS } from '../constants/categories';

export default function Dashboard() {
  const { entries, loading, error, refetch } = useTimeEntries();

  // Compute Summary KPI Statistics
  const stats = useMemo(() => {
    let totalHours = 0;
    let billableHours = 0;
    let nonBillableHours = 0;
    const categoryTotals = { Development: 0, Design: 0, 'Client Meeting': 0 };

    entries.forEach((e) => {
      const h = Number(e.hours) || 0;
      totalHours += h;
      if (e.is_billable) {
        billableHours += h;
      } else {
        nonBillableHours += h;
      }
      if (categoryTotals[e.category] !== undefined) {
        categoryTotals[e.category] += h;
      }
    });

    const targetPercent = (billableHours / DEFAULT_WEEKLY_TARGET_HOURS) * 100;
    const billableRatio = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

    return {
      totalHours,
      billableHours,
      nonBillableHours,
      targetPercent,
      billableRatio,
      categoryTotals,
    };
  }, [entries]);

  const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

  return (
    <DashboardLayout>
      {/* Reusable Common Page Header Component */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time insights into your time logging and billable efficiency"
      />

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={refetch} />
      ) : (
        <>
          {/* Reusable Summary KPI Cards Grid (4 Cards via SummaryCard component) */}
          <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Total Hours Logged"
                value={stats.totalHours.toFixed(1)}
                suffix="hrs"
                prefix={<ClockCircleOutlined style={{ color: '#2563eb' }} />}
                subtitle={entries.length === 0 ? 'No entries recorded' : 'Across all active projects'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Billable Hours"
                value={stats.billableHours.toFixed(1)}
                suffix={`/ ${DEFAULT_WEEKLY_TARGET_HOURS} hrs`}
                prefix={<DollarCircleOutlined style={{ color: '#22c55e' }} />}
                valueStyle={{ color: '#22c55e', fontWeight: 800, fontSize: 28 }}
                subtitle={entries.length === 0 ? '0% target achieved' : `${stats.billableRatio.toFixed(0)}% of total hours`}
                subtitleColor="#22c55e"
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Non-Billable Hours"
                value={stats.nonBillableHours.toFixed(1)}
                suffix="hrs"
                prefix={<ThunderboltOutlined style={{ color: '#d97706' }} />}
                valueStyle={{ color: '#d97706', fontWeight: 800, fontSize: 28 }}
                subtitle="Internal & administrative time"
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Weekly Target"
                value={`${stats.targetPercent.toFixed(0)}%`}
                subtitle={`Target: ${DEFAULT_WEEKLY_TARGET_HOURS} billable hrs/week`}
                progress={stats.targetPercent}
                progressColor={stats.targetPercent >= 90 ? '#22c55e' : '#2563eb'}
              />
            </Col>
          </Row>

          {/* Recent Activity Feed or Animated Empty State */}
          <Card
            className="kpi-card"
            title={<span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Recent Time Entries</span>}
            extra={
              entries.length > 0 ? (
                <Link to="/timesheet" style={{ color: '#2563eb', fontWeight: 600, fontSize: 13 }}>
                  View All <RightOutlined style={{ fontSize: 10 }} />
                </Link>
              ) : null
            }
          >
            {entries.length === 0 ? (
              <EmptyState
                icon={<InboxOutlined style={{ fontSize: 52, color: '#2563eb' }} />}
                title="No time entries logged yet"
                description="Start tracking your work hours by adding your first entry on the Timesheet page."
                action={
                  <Link to="/timesheet">
                    <AppButton variant="primary" className="btn-gradient-primary" icon={<CalendarOutlined />}>
                      Go to Timesheet Log
                    </AppButton>
                  </Link>
                }
              />
            ) : (
              <TimesheetTable
                entries={recentEntries}
                showActions={false}
                pagination={false}
              />
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
