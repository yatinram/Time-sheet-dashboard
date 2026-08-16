import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * Thin wrapper around antd's Button so the rest of the app never imports
 * antd's Button directly. Centralizes variant naming in one place.
 */
const VARIANT_MAP = {
  primary: { type: 'primary' },
  default: { type: 'default' },
  danger: { type: 'primary', danger: true },
  text: { type: 'text' },
  link: { type: 'link' },
};

export default function AppButton({ variant = 'default', icon, loading, children, ...rest }) {
  const variantProps = VARIANT_MAP[variant] || VARIANT_MAP.default;
  return (
    <Button icon={icon} loading={loading} {...variantProps} {...rest}>
      {children}
    </Button>
  );
}

AppButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'default', 'danger', 'text', 'link']),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  children: PropTypes.node,
};
