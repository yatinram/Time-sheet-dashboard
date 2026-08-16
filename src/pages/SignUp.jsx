import { useState, useMemo } from 'react';
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
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import AppButton from '../components/common/AppButton';

const { Title, Text, Paragraph } = Typography;

/**
 * High-Security Password Schema
 * - Min 8 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Number (0-9)
 * - Special character (!@#$%^&* etc.)
 */
const highSecurityPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Must contain at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)');

const signUpSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: highSecurityPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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

export default function SignUp() {
  const { showSuccess, showError } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password', '');

  // Calculate high security password strength rating & checklist
  const passwordChecklist = useMemo(() => {
    return {
      minLen: passwordValue.length >= 8,
      upper: /[A-Z]/.test(passwordValue),
      lower: /[a-z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      special: /[^A-Za-z0-9]/.test(passwordValue),
    };
  }, [passwordValue]);

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return null;
    let score = 0;
    if (passwordChecklist.minLen) score++;
    if (passwordChecklist.upper) score++;
    if (passwordChecklist.lower) score++;
    if (passwordChecklist.number) score++;
    if (passwordChecklist.special) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }, [passwordValue, passwordChecklist]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await signUp(values.email, values.password);
      showSuccess('Account created successfully! You can now sign in.');
      navigate('/login');
    } catch (err) {
      triggerShake();
      showError(err.message || 'Failed to create account.');
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
              Start tracking your
              <br />
              billable hours.
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
          <div style={{ marginBottom: 28 }}>
            <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 6, fontWeight: 700 }}>
              Create your account
            </Title>
            <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Start tracking your billable hours
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
              style={{ marginBottom: passwordValue.length > 0 ? 12 : 24 }}
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

            {/* High-Security Real-time Password Security Checklist (Appears ONLY on onChange when typing) */}
            {passwordValue.length > 0 && (
              <div className="password-strength-container" style={{ marginBottom: 20 }}>
                {passwordStrength && (
                  <div className="password-strength-bar-track" style={{ marginBottom: 8 }}>
                    <div className={`password-strength-bar-fill strength-${passwordStrength}`} />
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
                  <span style={{ color: passwordChecklist.minLen ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: passwordChecklist.minLen ? 600 : 400 }}>
                    <CheckCircleOutlined style={{ fontSize: 12 }} /> 8+ અક્ષરો (Min 8 Chars)
                  </span>
                  <span style={{ color: passwordChecklist.upper ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: passwordChecklist.upper ? 600 : 400 }}>
                    <CheckCircleOutlined style={{ fontSize: 12 }} /> 1 Uppercase (A-Z)
                  </span>
                  <span style={{ color: passwordChecklist.lower ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: passwordChecklist.lower ? 600 : 400 }}>
                    <CheckCircleOutlined style={{ fontSize: 12 }} /> 1 Lowercase (a-z)
                  </span>
                  <span style={{ color: passwordChecklist.number ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: passwordChecklist.number ? 600 : 400 }}>
                    <CheckCircleOutlined style={{ fontSize: 12 }} /> 1 નંબર (0-9)
                  </span>
                  <span style={{ color: passwordChecklist.special ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: passwordChecklist.special ? 600 : 400, gridColumn: 'span 2' }}>
                    <CheckCircleOutlined style={{ fontSize: 12 }} /> 1 સ્પેશિયલ સંજ્ઞા (!@#$%^&*)
                  </span>
                </div>
              </div>
            )}

            <Form.Item
              label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Confirm Password</span>}
              validateStatus={errors.confirmPassword ? 'error' : ''}
              help={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    size="large"
                    prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                    placeholder="••••••••"
                    style={authInputStyleError(errors.confirmPassword)}
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
              Sign Up
            </AppButton>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
                Sign in
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
