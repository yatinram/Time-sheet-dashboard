import { Avatar, Button, Divider, Layout, Space, Tooltip, Typography } from 'antd';
import {
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header({ onToggleMobileMenu }) {
  const { showInfo, showError } = useToast();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      showInfo(' Signed out successfully');
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Failed to sign out');
    }
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <AntHeader className="enterprise-header">
      {/* Left Side: Mobile Hamburger Toggle Button */}
      <div className="header-left-section">
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 20, color: 'var(--text-primary)' }} />}
          onClick={onToggleMobileMenu}
          className="mobile-hamburger-btn"
          aria-label="Toggle Navigation Menu"
        />
      </div>

      {/* Right Side: Theme Toggle, User Profile & Sign Out */}
      <Space size={8} align="center" className="header-right-section">
        {/* Theme Toggle */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            icon={
              isDark ? (
                <SunOutlined style={{ fontSize: 17, color: '#f59e0b' }} />
              ) : (
                <MoonOutlined style={{ fontSize: 17, color: '#475569' }} />
              )
            }
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          />
        </Tooltip>

        <Divider type="vertical" className="header-divider" />

        {/* User Profile Chip */}
        <div className="header-user-chip">
          <Avatar size={32} icon={!userInitial ? <UserOutlined /> : null} className="header-avatar">
            {userInitial}
          </Avatar>
          <Text className="header-email-text" ellipsis>
            {user?.email}
          </Text>
        </div>

        <Divider type="vertical" className="header-divider" />

        {/* Sign Out */}
        <Tooltip title="Sign Out">
          <Button
            type="text"
            icon={<LogoutOutlined style={{ fontSize: 16 }} />}
            onClick={handleSignOut}
            className="signout-btn"
            aria-label="Sign Out"
          >
            <span className="signout-label">Sign Out</span>
          </Button>
        </Tooltip>
      </Space>
    </AntHeader>
  );
}

Header.propTypes = {
  onToggleMobileMenu: PropTypes.func,
};
