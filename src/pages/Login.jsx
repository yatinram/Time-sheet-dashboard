import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input, Typography } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  TagOutlined,
  BarChartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import AppButton from '../components/common/AppButton';

const { Title, Text, Paragraph } = Typography;

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const features = [
  {
    icon: <ClockCircleOutlined style={{ fontSize: 18, color: '#60a5fa' }} />,
    text: 'Log hours in seconds',
  },
  {
    icon: <TagOutlined style={{ fontSize: 18, color: '#60a5fa' }} />,
    text: 'Organize by category & client',
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 18, color: '#60a5fa' }} />,
    text: 'See billable vs non-billable at a glance',
  },
];

/* Theme-aware input style using CSS variables */
const authInputStyle = {
  backgroundColor: 'var(--bg-base)',
  borderColor: 'var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 10,
};

const authInputStyleError = (hasError) => ({
  ...authInputStyle,
  borderColor: hasError ? '#ef4444' : 'var(--border-subtle)',
});

export default function Login() {
  const { showSuccess, showError } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      showSuccess('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      triggerShake();
      showError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* ── LEFT PANEL (~55% width) ── */}
      <div className="auth-split-left">
        <div className="auth-dot-grid" />
        <div className="auth-left-content">
          {/* Top Logo */}
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <FieldTimeOutlined style={{ fontSize: 24, color: '#60a5fa' }} />
            </div>
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              Timesheet Tracker
            </Title>
          </div>

          {/* Headline & Subtext */}
          <div style={{ marginTop: 40 }}>
            <Title
              level={1}
              style={{
                color: '#fff',
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: '-0.5px',
                marginBottom: 16,
              }}
            >
              Track your time.
              <br />
              Bill with confidence.
            </Title>
            <Paragraph
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: 380,
              }}
            >
              One place to log hours, tag them by project, and see exactly what&apos;s billable —
              built for teams who bill by the hour.
            </Paragraph>
          </div>

          {/* 3 Staggered Feature Rows */}
          <div className="auth-feature-list">
            {features.map((f, i) => (
              <div key={i} className="auth-feature-row">
                <div className="auth-feature-icon-wrapper">{f.icon}</div>
                <Text style={{ color: '#e5e7eb', fontSize: 14, fontWeight: 500 }}>
                  {f.text}
                </Text>
              </div>
            ))}
          </div>

          {/* Stat Line + Animated Progress Bar (0% -> 78%) */}
          <div className="auth-stat-box">
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>10,000+</Text>
            <br />
            <Text style={{ color: '#9ca3af', fontSize: 13 }}>
              hours logged by teams like yours this month
            </Text>
            <div className="auth-stat-bar-track">
              <div className="auth-stat-bar-fill" />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (~45% width) ── */}
      <div className="auth-split-right">
        <div className={`auth-form-card ${shake ? 'shake-error' : ''}`}>
          <div style={{ marginBottom: 32 }}>
            <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 6, fontWeight: 700 }}>
              Welcome back
            </Title>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Sign in to log your work hours
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit(onSubmit, triggerShake)}>
            <Form.Item
              label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Email</span>}
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                    placeholder="you@company.com"
                    style={authInputStyleError(errors.email)}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Password</span>}
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    size="large"
                    prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                    suffix={
                      showPassword ? (
                        <EyeInvisibleOutlined
                          onClick={() => setShowPassword(false)}
                          style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                        />
                      ) : (
                        <EyeOutlined
                          onClick={() => setShowPassword(true)}
                          style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                        />
                      )
                    }
                    placeholder="••••••••"
                    style={authInputStyleError(errors.password)}
                  />
                )}
              />
            </Form.Item>

            <AppButton
              variant="primary"
              htmlType="submit"
              block
              className="btn-gradient-primary"
              loading={submitting}
              disabled={!isValid}
              style={{ height: 46, fontSize: 15, fontWeight: 600, marginTop: 8 }}
            >
              Sign In
            </AppButton>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600 }}>
                Sign up
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
