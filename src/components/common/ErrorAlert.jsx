import { Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import AppButton from './AppButton';

/**
 * Standard error state used whenever a network/Supabase call fails.
 * Always paired with a Retry action so the user isn't stuck.
 */
export default function ErrorAlert({ message, onRetry }) {
  return (
    <Alert
      type="error"
      showIcon
      icon={<WarningOutlined />}
      message="Something went wrong"
      description={message || 'We could not load your data. Please check your connection and try again.'}
      action={
        onRetry && (
          <AppButton variant="danger" size="small" onClick={onRetry}>
            Retry
          </AppButton>
        )
      }
      style={{ borderRadius: 8 }}
    />
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
