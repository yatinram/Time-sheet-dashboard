import { Card, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { DEFAULT_WEEKLY_TARGET_HOURS } from '../constants/categories';

const { Text } = Typography;

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Reusable Common Page Header Component */}
      <PageHeader
        title="Settings & Account"
        subtitle="System configurations, target thresholds, and user security status"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
        {/* User Account Settings */}
        <Card
          className="kpi-card"
          title={
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              <UserOutlined style={{ color: '#2563eb', marginRight: 8 }} />
              Account Profile
            </span>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'block' }}>Email Address</Text>
              <Text style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>{user?.email || 'N/A'}</Text>
            </div>
            <div>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'block' }}>User ID</Text>
              <Text style={{ color: '#2563eb', fontSize: 13, fontFamily: 'monospace' }}>{user?.id || 'N/A'}</Text>
            </div>
          </div>
        </Card>

        {/* Weekly Target Configuration */}
        <Card
          className="kpi-card"
          title={
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              <SettingOutlined style={{ color: '#c084fc', marginRight: 8 }} />
              Weekly Target Settings
            </span>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>Default Weekly Target</Text>
              <Text style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'block' }}>Standard weekly target hours for billable progress formula</Text>
            </div>
            <Tag color="purple" style={{ fontSize: 14, padding: '4px 12px', fontWeight: 700 }}>
              {DEFAULT_WEEKLY_TARGET_HOURS} Hours / Week
            </Tag>
          </div>
        </Card>

        {/* Database RLS Isolation Badge */}
        <Card
          className="kpi-card"
          title={
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              <SafetyCertificateOutlined style={{ color: '#22c55e', marginRight: 8 }} />
              Database Row Level Security (RLS)
            </span>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag color="success" style={{ fontSize: 13, padding: '4px 10px', fontWeight: 600 }}>
              RLS Isolated
            </Tag>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Your time entries are strictly isolated at the database level using Supabase RLS policy `auth.uid() = user_id`.
            </Text>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
